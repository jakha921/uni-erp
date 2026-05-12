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
import { useTranslation } from 'react-i18next';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard } from '@/components/data-display';
import { AlertBanner, Badge, Button, Spinner } from '@/components/ui';
import { DataTable, type Column } from '@/components/table/DataTable';
import { SearchInput } from '@/components/form/SearchInput';
import { Select } from '@/components/ui/Select';
import { useTasksList, useUpdateTaskStatus, useCreateTask, useDeleteTask } from '@/api/hooks/useTasks';
import { useTeachersList } from '@/api/hooks/useTeachers';
import { ConfirmDialog } from '@/components/overlays';
import { TaskForm } from '../components/TaskForm';
import type { Task, TaskStatus, TaskPriority } from '@/types/operations';
import type { TaskFormData } from '../schemas/task.schema';

const KANBAN_COLUMN_CONFIG: { id: TaskStatus; color: string; bg: string }[] = [
  { id: 'todo', color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'in_progress', color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'done', color: '#2DB976', bg: '#ECFDF5' },
  { id: 'review', color: '#8B5CF6', bg: '#F5F3FF' },
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
  const { t } = useTranslation();
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dragId, setDragId] = useState<number | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  const PRIORITY_LABELS: Record<TaskPriority, string> = {
    low: t('operations.priorityLow'),
    medium: t('operations.priorityMedium'),
    high: t('operations.priorityHigh'),
    urgent: t('operations.priorityUrgent'),
  };

  const STATUS_LABELS: Record<TaskStatus, string> = {
    todo: t('operations.statusTodo'),
    in_progress: t('operations.statusInProgress'),
    review: t('operations.statusReview'),
    done: t('operations.statusDone'),
  };

  const PRIORITY_OPTIONS = (['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((p) => ({
    value: p,
    label: PRIORITY_LABELS[p],
  }));

  const STATUS_OPTIONS = (['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  }));

  const KANBAN_COLUMNS = KANBAN_COLUMN_CONFIG.map((cfg) => ({
    ...cfg,
    label: STATUS_LABELS[cfg.id],
  }));

  const { data: tasksData, isLoading, error } = useTasksList({
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

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (priorityFilter && task.priority !== priorityFilter) return false;
      if (statusFilter && task.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, search, priorityFilter, statusFilter]);

  const counts = useMemo(() => {
    const c = { total: tasks.length, todo: 0, inProgress: 0, done: 0 };
    for (const task of tasks) {
      if (task.status === 'todo') c.todo++;
      else if (task.status === 'in_progress') c.inProgress++;
      else if (task.status === 'done') c.done++;
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
      header: t('operations.taskTitle'),
      render: (row) => <span className="font-medium text-slate-900">{row.title}</span>,
    },
    {
      key: 'assigneeName',
      header: t('common.assignee'),
      render: (row) => <span className="text-slate-600">{row.assigneeName}</span>,
    },
    {
      key: 'dueDate',
      header: t('operations.dueDate'),
      render: (row) => (
        <span className="text-muted tabular-nums text-xs">{row.dueDate}</span>
      ),
    },
    {
      key: 'priority',
      header: t('common.priority'),
      render: (row) => (
        <Badge variant={priorityVariant(row.priority)} dot>
          {PRIORITY_LABELS[row.priority]}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: t('common.status'),
      render: (row) => (
        <Badge variant={statusVariant(row.status)} dot>
          {STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
  ];

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader
        title={t('nav.tasks')}
        subtitle={t('operations.tasksSubtitle')}
        breadcrumbs={[{ label: t('nav.operations') }, { label: t('nav.tasks') }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setFormOpen(true)}>
            {t('operations.addTask')}
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard
          label={t('common.total')}
          value={counts.total}
          icon={<ClipboardList className="h-[18px] w-[18px]" />}
          iconBg="#3B82F6"
        />
        <StatCard
          label={t('operations.statusTodo')}
          value={counts.todo}
          icon={<Plus className="h-[18px] w-[18px]" />}
          iconBg="#8B5CF6"
        />
        <StatCard
          label={t('operations.statusInProgress')}
          value={counts.inProgress}
          icon={<Clock className="h-[18px] w-[18px]" />}
          iconBg="#F59E0B"
        />
        <StatCard
          label={t('operations.statusDone')}
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
            {t('operations.listView')}
          </button>
        </div>

        <SearchInput
          placeholder={t('operations.searchTask')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          className="w-64"
        />

        <Select
          options={PRIORITY_OPTIONS}
          placeholder={t('common.priority')}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        />

        <Select
          options={STATUS_OPTIONS}
          placeholder={t('common.status')}
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
            const colTasks = filtered.filter((task) => task.status === col.id);
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
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDragId(task.id)}
                      onDragEnd={() => {
                        setDragId(null);
                        setOverCol(null);
                      }}
                      className="cursor-grab rounded-[10px] border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md"
                      style={{
                        opacity: dragId === task.id ? 0.5 : 1,
                        boxShadow:
                          dragId === task.id
                            ? '0 8px 16px rgba(0,0,0,0.12)'
                            : '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div className="mb-2">
                        <Badge variant={priorityVariant(task.priority)} dot>
                          {PRIORITY_LABELS[task.priority]}
                        </Badge>
                      </div>
                      <p className="text-[13px] font-medium leading-tight text-slate-900">
                        {task.title}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assigneeName}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
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
        title={t('operations.deleteTaskTitle')}
        message={t('operations.deleteTaskConfirm', { title: deleteTask?.title ?? '' })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteTaskMutation.isPending}
      />
    </PageContent>
  );
}
