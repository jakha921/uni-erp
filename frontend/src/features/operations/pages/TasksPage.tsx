import { useState, useMemo, useCallback } from 'react';
import {
  ClipboardList,
  Plus,
  Clock,
  AlertTriangle,
  LayoutGrid,
  List,
  User,
  Calendar,
} from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { DataTable, type Column } from '@/components/table/DataTable';
import { SearchInput } from '@/components/form/SearchInput';
import { Select } from '@/components/ui/Select';
import { useTasksList, useUpdateTaskStatus, useCreateTask, useDeleteTask } from '@/api/hooks/useTasks';
import { useTeachersList } from '@/api/hooks/useTeachers';
import { ConfirmDialog } from '@/components/overlays';
import { TaskForm } from '../components/TaskForm';
import type { Task, TaskStatus, TaskPriority } from '@/types/operations';
import type { TaskFormData } from '../schemas/task.schema';

// --- UI labels ---

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Past',
  medium: "O'rta",
  high: 'Yuqori',
  urgent: 'Juda yuqori',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Yangi',
  in_progress: 'Jarayonda',
  review: "Ko'rib chiqilmoqda",
  done: 'Bajarildi',
};

const PRIORITY_OPTIONS = (['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => ({
  value: p,
  label: PRIORITY_LABELS[p],
}));

const STATUS_OPTIONS = (['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map((s) => ({
  value: s,
  label: STATUS_LABELS[s],
}));

const KANBAN_COLUMNS: { id: TaskStatus; label: string; color: string; bg: string }[] = [
  { id: 'todo', label: 'Yangi', color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'in_progress', label: 'Jarayonda', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'done', label: 'Bajarildi', color: '#2DB976', bg: '#ECFDF5' },
  { id: 'review', label: "Ko'rib chiqilmoqda", color: '#8B5CF6', bg: '#F5F3FF' },
];

function priorityVariant(p: TaskPriority): 'error' | 'warning' | 'info' {
  if (p === 'high' || p === 'urgent') return 'error';
  if (p === 'medium') return 'warning';
  return 'info';
}

function statusVariant(s: TaskStatus): 'info' | 'warning' | 'success' | 'error' {
  if (s === 'todo') return 'info';
  if (s === 'in_progress') return 'warning';
  if (s === 'done') return 'success';
  return 'error';
}

type ViewMode = 'list' | 'kanban';

export function TasksPage() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dragId, setDragId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const { data: tasksData, isLoading } = useTasksList({
    page: 1,
    pageSize: 50,
    search: search || undefined,
    priority: (priorityFilter as TaskPriority) || undefined,
    status: (statusFilter as TaskStatus) || undefined,
  });

  const updateStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const deleteTaskMutation = useDeleteTask();
  const { data: teachersData } = useTeachersList({ page: 1, pageSize: 100 });
  const assignees = (teachersData?.data ?? []).map((t) => ({ id: t.id, fullName: t.fullName }));

  const tasks = tasksData?.data ?? [];

  // Client-side filtering for instant search responsiveness
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (priorityFilter && t.priority !== priorityFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, search, priorityFilter, statusFilter]);

  const counts = useMemo(() => {
    const c = { total: tasks.length, todo: 0, inProgress: 0, done: 0 };
    for (const t of tasks) {
      if (t.status === 'todo') c.todo++;
      else if (t.status === 'in_progress') c.inProgress++;
      else if (t.status === 'done') c.done++;
    }
    return c;
  }, [tasks]);

  const handleDrop = useCallback(
    (colId: TaskStatus) => {
      if (dragId !== null) {
        updateStatus.mutate({ id: dragId, status: colId });
      }
      setDragId(null);
      setOverCol(null);
    },
    [dragId, updateStatus],
  );

  const columns: Column<Task>[] = [
    {
      key: 'id',
      header: '#',
      width: '60px',
      render: (row) => <span className="text-muted">{row.id}</span>,
    },
    {
      key: 'title',
      header: 'Topshiriq',
      render: (row) => <span className="font-medium text-slate-900">{row.title}</span>,
    },
    {
      key: 'assigneeName',
      header: 'Bajaruvchi',
      render: (row) => <span className="text-slate-600">{row.assigneeName}</span>,
    },
    {
      key: 'dueDate',
      header: 'Muddat',
      render: (row) => (
        <span className="text-muted tabular-nums text-xs">{row.dueDate}</span>
      ),
    },
    {
      key: 'priority',
      header: 'Muhimlik',
      render: (row) => (
        <Badge variant={priorityVariant(row.priority)} dot>
          {PRIORITY_LABELS[row.priority]}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => (
        <Badge variant={statusVariant(row.status)} dot>
          {STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
  ];

  return (
    <PageContent>
      <PageHeader
        title="Topshiriqlar"
        subtitle="Barcha topshiriqlar va ularning holati"
        breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Topshiriqlar' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            Topshiriq qo{"'"}shish
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Jami"
          value={counts.total}
          icon={<ClipboardList className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label="Yangi"
          value={counts.todo}
          icon={<Plus className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
        <StatCard
          label="Jarayonda"
          value={counts.inProgress}
          icon={<Clock className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label="Bajarildi"
          value={counts.done}
          icon={<AlertTriangle className="h-[18px] w-[18px]" />}
          iconBg="#2DB976"
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex gap-1 rounded-lg border border-border bg-white p-0.5">
          <button
            onClick={() => setView('kanban')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              view === 'kanban'
                ? 'bg-primary-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setView('list')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              view === 'list'
                ? 'bg-primary-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Ro{"'"}yxat
          </button>
        </div>

        <SearchInput
          placeholder="Topshiriq izlash..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          className="w-64"
        />

        <Select
          options={PRIORITY_OPTIONS}
          placeholder="Muhimlik"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        />

        <Select
          options={STATUS_OPTIONS}
          placeholder="Holat"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* List View */}
      {!isLoading && view === 'list' && (
        <div className="rounded-2xl bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
          <DataTable data={filtered} columns={columns} keyField="id" />
        </div>
      )}

      {/* Kanban View */}
      {!isLoading && view === 'kanban' && (
        <div className="grid grid-cols-4 gap-3.5">
          {KANBAN_COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverCol(col.id);
                }}
                onDragLeave={() => setOverCol(null)}
                onDrop={() => handleDrop(col.id)}
                className="rounded-xl p-3 min-h-[420px] transition-colors"
                style={{
                  background: overCol === col.id ? col.bg : '#F8FAFB',
                  border:
                    overCol === col.id
                      ? `2px dashed ${col.color}`
                      : '2px dashed transparent',
                }}
              >
                {/* Column header */}
                <div className="flex items-center gap-2 px-1.5 pb-3">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: col.color }}
                  />
                  <span className="text-[13px] font-semibold text-slate-900 flex-1">
                    {col.label}
                  </span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-muted">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverCol(null);
                      }}
                      className="cursor-grab rounded-[10px] border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md"
                      style={{
                        opacity: dragId === t.id ? 0.5 : 1,
                        boxShadow:
                          dragId === t.id
                            ? '0 8px 16px rgba(0,0,0,0.12)'
                            : '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div className="mb-2">
                        <Badge variant={priorityVariant(t.priority)} dot>
                          {PRIORITY_LABELS[t.priority]}
                        </Badge>
                      </div>
                      <p className="text-[13px] font-medium leading-tight text-slate-900">
                        {t.title}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {t.assigneeName}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {t.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data: TaskFormData) => {
          createTask.mutate(
            { ...data, assigneeId: Number(data.assigneeId) },
            { onSuccess: () => setFormOpen(false) },
          );
        }}
        assignees={assignees}
        loading={createTask.isPending}
      />

      <ConfirmDialog
        open={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={() => {
          if (!deleteTask) return;
          deleteTaskMutation.mutate(deleteTask.id, { onSuccess: () => setDeleteTask(null) });
        }}
        title="Topshiriqni o'chirish"
        message={`"${deleteTask?.title}" topshirig'ini o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteTaskMutation.isPending}
      />
    </PageContent>
  );
}
