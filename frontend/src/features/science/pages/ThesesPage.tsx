import { useState, useMemo } from 'react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheses, useCreateThesis, useDeleteThesis } from '@/api/hooks/useScience';
import { useStudentsList } from '@/api/hooks/useStudents';
import { useTeachersList } from '@/api/hooks/useTeachers';
import { ThesisForm } from '../components/ThesisForm';
import type { Thesis } from '@/types/science';
import type { ThesisFormData } from '../schemas/thesis.schema';

type ThesisStage = Thesis['stage'];

const STAGE_LABELS: Record<ThesisStage, string> = {
  topic_approved: 'Birinchi sharx',
  in_progress: 'Tahrirlash',
  review: 'Himoyaga ruxsat',
  defense: 'Himoyada',
  completed: 'Himoyalandi',
};

const STAGE_COLORS: Record<ThesisStage, string> = {
  topic_approved: '#3B82F6',
  in_progress: '#F59E0B',
  review: '#8B5CF6',
  defense: '#EC4899',
  completed: '#2DB976',
};

const STAGE_BADGE_VARIANTS: Record<ThesisStage, 'info' | 'warning' | 'success' | 'default'> = {
  topic_approved: 'info',
  in_progress: 'warning',
  review: 'default',
  defense: 'warning',
  completed: 'success',
};

const FILTER_TABS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'topic_approved', label: 'Birinchi sharx' },
  { id: 'in_progress', label: 'Tahrirlash' },
  { id: 'review', label: 'Himoyaga ruxsat' },
  { id: 'completed', label: 'Himoyalandi' },
];

export function ThesesPage() {
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [supervisorFilter, setSupervisorFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteThesis, setDeleteThesis] = useState<Thesis | null>(null);

  const { data: thesesData, isLoading } = useTheses({ page: 1, pageSize: 50, stage: filter !== 'all' ? filter : undefined });
  const { data: studentsData } = useStudentsList({ page: 1, pageSize: 200 });
  const { data: teachersData } = useTeachersList({ page: 1, pageSize: 100 });
  const createThesis = useCreateThesis();
  const deleteThesisMutation = useDeleteThesis();

  const theses = thesesData?.data ?? [];
  const filtered = useMemo(() => theses.filter((t) => {
    if (filter !== 'all' && t.stage !== filter) return false;
    if (typeFilter && t.type !== typeFilter) return false;
    if (supervisorFilter && !t.supervisorName.toLowerCase().includes(supervisorFilter.toLowerCase())) return false;
    return true;
  }), [filter, typeFilter, supervisorFilter, theses]);
  const students = (studentsData?.data ?? []).map((s) => ({ id: s.id, fullName: s.fullName }));
  const supervisors = (teachersData?.data ?? []).map((t) => ({ id: t.id, fullName: t.fullName }));

  const handleCreate = (data: ThesisFormData) => {
    createThesis.mutate(
      { ...data, studentId: Number(data.studentId), supervisorId: Number(data.supervisorId) },
      { onSuccess: () => setFormOpen(false) },
    );
  };

  return (
    <PageContent>
      <PageHeader
        title="Diplom ishlari"
        subtitle="Talabalar bitiruv malakaviy ishlari"
        breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Diplom ishlari' }]}
        actions={
          <Button variant="primary" size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Yangi diplom ishi
          </Button>
        }
      />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-lg border border-border px-3 text-sm"
          >
            <option value="">Barcha turlar</option>
            <option value="bakalavr">Bakalavr</option>
            <option value="magistr">Magistr</option>
          </select>
          <input
            type="text"
            value={supervisorFilter}
            onChange={(e) => setSupervisorFilter(e.target.value)}
            placeholder="Ilmiy rahbar..."
            className="h-9 rounded-lg border border-border px-3 text-sm w-40 outline-none focus:border-primary-400"
          />
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-12"><Spinner size="lg" /></div>}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-10 text-slate-400 text-sm">Diplom ishlari topilmadi</div>
      )}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((thesis) => (
            <ThesisCard key={thesis.id} thesis={thesis} onDelete={() => setDeleteThesis(thesis)} />
          ))}
        </div>
      )}

      <ThesisForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        students={students}
        supervisors={supervisors}
        loading={createThesis.isPending}
      />

      <ConfirmDialog
        open={!!deleteThesis}
        onClose={() => setDeleteThesis(null)}
        onConfirm={() => {
          if (!deleteThesis) return;
          deleteThesisMutation.mutate(deleteThesis.id, { onSuccess: () => setDeleteThesis(null) });
        }}
        title="Diplom ishini o'chirish"
        message={`"${deleteThesis?.title}" ishini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteThesisMutation.isPending}
      />
    </PageContent>
  );
}

function ThesisCard({ thesis, onDelete }: { thesis: Thesis; onDelete: () => void }) {
  const topColor = STAGE_COLORS[thesis.stage] ?? '#94A3B8';
  const initials = thesis.studentName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Card className="overflow-hidden">
      <div className="h-[3px] -mx-6 -mt-6 mb-4" style={{ backgroundColor: topColor }} />
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">DIP-{thesis.id}</span>
        <Badge variant={STAGE_BADGE_VARIANTS[thesis.stage] ?? 'default'} dot>
          {STAGE_LABELS[thesis.stage] ?? thesis.stage}
        </Badge>
        {thesis.grade != null && <Badge variant="success">Baho: {thesis.grade}/100</Badge>}
        <button type="button" onClick={onDelete} className="ml-auto p-1 text-slate-400 hover:text-red-600 rounded">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <h4 className="text-[14px] font-semibold text-slate-900 leading-snug mb-2.5">{thesis.title}</h4>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
          {initials}
        </div>
        <span className="text-[13px] font-medium text-slate-900">{thesis.studentName}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>Rahbar: <strong className="text-slate-700">{thesis.supervisorName}</strong></span>
        {thesis.defenseDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {thesis.defenseDate}
          </span>
        )}
      </div>
    </Card>
  );
}
