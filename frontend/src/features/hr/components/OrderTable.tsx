import { Eye, Trash2, ChevronRight, FileDown } from 'lucide-react';
import { DataTable, type Column } from '@/components/table';
import { Button } from '@/components/ui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatDate } from '@/lib/utils';
import type { HrOrder } from '@/types/hr';

const ORDER_STATUS_LABELS: Record<string, string> = {
  draft: 'Qoralama',
  review: "Ko'rib chiqilmoqda",
  signed: 'Imzolangan',
  cancelled: 'Bekor qilingan',
};

function printOrder(o: HrOrder) {
  const win = window.open('', '_blank', 'width=794,height=1123');
  if (!win) return;
  const d = win.document;
  const style = d.createElement('style');
  style.textContent = `
    body { font-family: 'Times New Roman', serif; margin: 0; padding: 50px 70px; color: #000; }
    h1 { text-align: center; font-size: 16px; text-transform: uppercase; margin-bottom: 4px; }
    h2 { text-align: center; font-size: 13px; margin-bottom: 20px; }
    .ot { text-align: center; font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 20px 0 4px; }
    .on { text-align: center; font-size: 13px; color: #555; margin-bottom: 30px; }
    .body-text { font-size: 14px; line-height: 1.8; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    td { padding: 7px 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
    td:first-child { color: #64748b; width: 40%; }
    td:last-child { font-weight: 600; }
    .sigs { display: flex; justify-content: space-between; margin-top: 60px; font-size: 12px; }
    @media print { @page { margin: 0; } body { padding: 50px 70px; } }
  `;
  d.head.appendChild(style);
  const today = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
  const h1 = d.createElement('h1'); h1.textContent = "O'zbekiston Respublikasi"; d.body.appendChild(h1);
  const h2 = d.createElement('h2'); h2.textContent = 'Buxoro innovatsion texnologiyalar universiteti'; d.body.appendChild(h2);
  const ot = d.createElement('div'); ot.className = 'ot'; ot.textContent = 'BUYRUQ'; d.body.appendChild(ot);
  const on = d.createElement('div'); on.className = 'on'; on.textContent = `№ ${o.number} | ${formatDate(o.date)}`; d.body.appendChild(on);
  const bt = d.createElement('p'); bt.className = 'body-text'; bt.textContent = `${o.title}.`; d.body.appendChild(bt);
  const rows: [string, string][] = [
    ['Xodim', o.employeeName],
    ['Buyruq turi', o.typeLabel],
    ['Kuchga kirish sanasi', formatDate(o.effectiveDate)],
    ['Asos', o.basis],
    ['Imzolayan', o.signer],
    ['Holati', ORDER_STATUS_LABELS[o.status] ?? o.status],
  ];
  const table = d.createElement('table');
  rows.forEach(([l, v]) => {
    const tr = d.createElement('tr');
    const t1 = d.createElement('td'); t1.textContent = l;
    const t2 = d.createElement('td'); t2.textContent = v || '—';
    tr.appendChild(t1); tr.appendChild(t2); table.appendChild(tr);
  });
  d.body.appendChild(table);
  const sigs = d.createElement('div'); sigs.className = 'sigs';
  const sb = (lines: string[]) => { const div = d.createElement('div'); lines.forEach(t => { const p = d.createElement('p'); p.textContent = t; p.style.margin = '4px 0'; div.appendChild(p); }); return div; };
  sigs.appendChild(sb(['Rektor:', '___________________________', `Sana: ${today}`]));
  sigs.appendChild(sb(['M.O.']));
  d.body.appendChild(sigs);
  d.close(); win.focus(); setTimeout(() => { win.print(); win.close(); }, 250);
}

const NEXT_STATUS: Partial<Record<HrOrder['status'], HrOrder['status']>> = {
  draft: 'review',
  review: 'signed',
};

const NEXT_STATUS_LABEL: Partial<Record<HrOrder['status'], string>> = {
  draft: "Ko'rib chiqishga",
  review: 'Imzolash',
};

interface OrderTableProps {
  data: HrOrder[];
  onView?: (order: HrOrder) => void;
  onStatusChange?: (order: HrOrder, status: HrOrder['status']) => void;
  onDelete?: (order: HrOrder) => void;
}

export function OrderTable({ data, onView, onStatusChange, onDelete }: OrderTableProps) {
  const columns: Column<HrOrder>[] = [
    {
      key: 'number',
      header: 'Raqam va sana',
      width: '140px',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{row.number}</div>
          <div className="text-xs text-muted mt-0.5">{formatDate(row.date)}</div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Buyruq turi',
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: row.typeColor }}
          />
          <span className="text-sm font-medium">{row.typeLabel}</span>
        </span>
      ),
    },
    {
      key: 'employeeName',
      header: 'Xodim',
      render: (row) => <span className="text-sm">{row.employeeName}</span>,
    },
    {
      key: 'basis',
      header: 'Asos',
      render: (row) => <span className="text-sm text-muted">{row.basis}</span>,
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => <OrderStatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyField="id"
      onRowClick={onView}
      emptyMessage="Buyruqlar topilmadi"
      actions={(row) => {
        const nextStatus = NEXT_STATUS[row.status];
        const nextLabel = NEXT_STATUS_LABEL[row.status];
        return (
          <div className="flex items-center gap-1 justify-end">
            {onStatusChange && nextStatus && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ChevronRight className="h-4 w-4" />}
                onClick={(e) => { e.stopPropagation(); onStatusChange(row, nextStatus); }}
                title={nextLabel}
              >
                {nextLabel}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Eye className="h-4 w-4" />}
              onClick={(e) => { e.stopPropagation(); onView?.(row); }}
            >
              Ko&apos;rish
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={(e) => { e.stopPropagation(); printOrder(row); }}
              title="PDF yuklab olish"
            />
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                className="h-7 w-7 rounded-md hover:bg-red-50 text-red-400 inline-flex items-center justify-center transition-colors"
                title="O'chirish"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        );
      }}
    />
  );
}
