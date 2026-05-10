import { Eye, Pencil, Trash2, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable, type Column } from '@/components/table';
import { Badge } from '@/components/ui';
import { DropdownMenu } from '@/components/overlays';
import { formatMoney, formatDate } from '@/lib/utils';
import type { Contract, ContractType, ContractStatus } from '@/types/finance';

const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  bazoviy: 'Bazoviy',
  tabaqalashtirilgan: 'Tabaqalashtirilgan',
  grant: 'Grant',
  xorijiy: 'Xorijiy',
};

function printContract(c: Contract) {
  const win = window.open('', '_blank', 'width=794,height=1123');
  if (!win) return;
  const d = win.document;
  const style = d.createElement('style');
  style.textContent = `
    body { font-family: 'Times New Roman', serif; margin: 0; padding: 50px 70px; color: #000; }
    h1 { text-align: center; font-size: 16px; text-transform: uppercase; margin-bottom: 4px; }
    h2 { text-align: center; font-size: 13px; margin-bottom: 20px; }
    .ct { text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0 4px; }
    .cn { text-align: center; font-size: 13px; color: #555; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 7px 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
    td:first-child { color: #64748b; width: 45%; }
    td:last-child { font-weight: 600; }
    .amt { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
    .amt-v { font-size: 24px; font-weight: bold; color: #16a34a; }
    .sigs { display: flex; justify-content: space-between; margin-top: 60px; font-size: 12px; }
    @media print { @page { margin: 0; } body { padding: 50px 70px; } }
  `;
  d.head.appendChild(style);
  const today = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
  const h1 = d.createElement('h1'); h1.textContent = "O'zbekiston Respublikasi"; d.body.appendChild(h1);
  const h2 = d.createElement('h2'); h2.textContent = 'Buxoro innovatsion texnologiyalar universiteti'; d.body.appendChild(h2);
  const ct = d.createElement('div'); ct.className = 'ct'; ct.textContent = "TA'LIM SHARTNOMASI"; d.body.appendChild(ct);
  const cn = d.createElement('div'); cn.className = 'cn'; cn.textContent = `№ ${c.contractNumber} | Sana: ${formatDate(c.contractDate)}`; d.body.appendChild(cn);
  const rows: [string, string][] = [
    ['Talaba', c.studentName],
    ['Talaba ID', c.studentIdNumber],
    ['Fakultet', c.facultyName],
    ['Mutaxassislik', c.specialty],
    ['Guruh', c.groupName],
    ['Kurs', c.level],
    ["O'quv yili", c.educationYear],
    ["Turi", CONTRACT_TYPE_LABELS[c.contractType]],
  ];
  const table = d.createElement('table');
  rows.forEach(([l, v]) => {
    const tr = d.createElement('tr');
    const t1 = d.createElement('td'); t1.textContent = l;
    const t2 = d.createElement('td'); t2.textContent = v || '—';
    tr.appendChild(t1); tr.appendChild(t2); table.appendChild(tr);
  });
  d.body.appendChild(table);
  const amt = d.createElement('div'); amt.className = 'amt';
  const al = d.createElement('div'); al.textContent = 'Shartnoma summasi'; al.style.fontSize = '12px'; al.style.color = '#64748b';
  const av = d.createElement('div'); av.className = 'amt-v'; av.textContent = formatMoney(c.contractAmount);
  amt.appendChild(al); amt.appendChild(av); d.body.appendChild(amt);
  const sigs = d.createElement('div'); sigs.className = 'sigs';
  const sb = (lines: string[]) => { const div = d.createElement('div'); lines.forEach(t => { const p = d.createElement('p'); p.textContent = t; p.style.margin = '4px 0'; div.appendChild(p); }); return div; };
  sigs.appendChild(sb(['Universitet nomidan:', 'Rektor: _______________________', `Sana: ${today}`]));
  sigs.appendChild(sb(['Talaba:', c.studentName, 'Imzo: _______________________']));
  d.body.appendChild(sigs);
  d.close(); win.focus(); setTimeout(() => { win.print(); win.close(); }, 250);
}

const CONTRACT_TYPE_CONFIG: Record<ContractType, { variant: 'info' | 'warning' | 'success' | 'default'; label: string }> = {
  bazoviy: { variant: 'info', label: 'Bazoviy' },
  tabaqalashtirilgan: { variant: 'warning', label: 'Tabaqalashtirilgan' },
  grant: { variant: 'success', label: 'Grant' },
  xorijiy: { variant: 'default', label: 'Xorijiy' },
};

const CONTRACT_STATUS_CONFIG: Record<ContractStatus, { variant: 'success' | 'default' | 'error'; label: string }> = {
  active: { variant: 'success', label: 'Faol' },
  completed: { variant: 'default', label: 'Yakunlangan' },
  cancelled: { variant: 'error', label: 'Bekor qilingan' },
};

interface ContractTableProps {
  data: Contract[];
  page?: number;
  pageSize?: number;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
  onRowClick?: (contract: Contract) => void;
}

export function ContractTable({
  data,
  page = 1,
  pageSize = 10,
  onEdit,
  onDelete,
  onRowClick,
}: ContractTableProps) {
  const navigate = useNavigate();

  const columns: Column<Contract>[] = [
    {
      key: 'idx',
      header: '#',
      width: '50px',
      render: (_, index) => (
        <span className="text-slate-500">{(page - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      key: 'contractNumber',
      header: 'Kontrakt №',
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-slate-900">{row.contractNumber}</span>
      ),
    },
    {
      key: 'studentName',
      header: 'Talaba',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-slate-900">{row.studentName}</p>
          <p className="text-[11.5px] text-muted">{row.groupName}</p>
        </div>
      ),
    },
    {
      key: 'facultyName',
      header: 'Fakultet',
      render: (row) => (
        <span className="text-[12.5px]">{(row.facultyName ?? '').split(' ').slice(0, 2).join(' ')}</span>
      ),
    },
    {
      key: 'level',
      header: 'Kurs',
      render: (row) => <span>{row.level}</span>,
    },
    {
      key: 'contractType',
      header: 'Turi',
      render: (row) => {
        const cfg = CONTRACT_TYPE_CONFIG[row.contractType];
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
    {
      key: 'contractAmount',
      header: 'Summa',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span className="font-semibold tabular-nums">{formatMoney(row.contractAmount)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: "To'langan",
      render: (row) => {
        const pct =
          row.contractAmount > 0
            ? Math.round((row.paidAmount / row.contractAmount) * 100)
            : 0;
        return (
          <div className="min-w-[140px]">
            <p className="mb-1 text-xs tabular-nums text-muted">
              {formatMoney(row.paidAmount)} ({pct}%)
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded bg-slate-100">
              <div
                className="h-full rounded bg-primary-500 transition-all duration-300"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'debtAmount',
      header: 'Qarz',
      className: 'text-right',
      sortable: true,
      render: (row) => (
        <span
          className={`font-semibold tabular-nums ${
            row.debtAmount > 0 ? 'text-red-700' : 'text-green-700'
          }`}
        >
          {formatMoney(row.debtAmount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => {
        const cfg = CONTRACT_STATUS_CONFIG[row.status];
        return (
          <Badge variant={cfg.variant} dot>
            {cfg.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyField="id"
      onRowClick={(row) => onRowClick ? onRowClick(row) : navigate(`/finance/contracts/${row.id}`)}
      emptyMessage="Kontraktlar topilmadi"
      actions={(row) => (
        <DropdownMenu
          items={[
            {
              label: 'Tafsilotlar',
              icon: <Eye className="h-4 w-4" />,
              onClick: () => navigate(`/finance/contracts/${row.id}`),
            },
            {
              label: 'Shartnoma PDF',
              icon: <FileDown className="h-4 w-4" />,
              onClick: () => printContract(row),
            },
            ...(onEdit
              ? [
                  {
                    label: 'Tahrirlash',
                    icon: <Pencil className="h-4 w-4" />,
                    onClick: () => onEdit(row),
                  },
                ]
              : []),
            ...(onDelete
              ? [
                  {
                    label: "O'chirish",
                    icon: <Trash2 className="h-4 w-4" />,
                    danger: true,
                    onClick: () => onDelete(row),
                  },
                ]
              : []),
          ]}
        />
      )}
    />
  );
}
