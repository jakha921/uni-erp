import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap, FileText, Globe, Users, BookOpen, MapPin, Home, Briefcase, ArrowLeft, Plus, Pencil, Trash2,
  type LucideIcon,
} from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { Button, Spinner, AlertBanner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import { useDictionaryItems, useCreateDictionaryItem, useUpdateDictionaryItem, useDeleteDictionaryItem } from '@/api/hooks/useDictionary';
import { DictionaryItemForm } from '../components/DictionaryItemForm';
import type { DictionaryType, DictionaryItem, CreateDictionaryItemDto } from '@/types/admin';

interface DictConfig {
  type: DictionaryType;
  icon: LucideIcon;
  name: string;
  color: string;
}

const DICT_CONFIGS: DictConfig[] = [
  { type: 'directions', icon: GraduationCap, name: "Yo'nalishlar", color: '#2DB976' },
  { type: 'programs', icon: FileText, name: 'Dasturlar', color: '#3B82F6' },
  { type: 'languages', icon: Globe, name: 'Tillar', color: '#06B6D4' },
  { type: 'nationalities', icon: Users, name: 'Millatlar', color: '#F59E0B' },
  { type: 'subject_types', icon: BookOpen, name: 'Fan turlari', color: '#8B5CF6' },
  { type: 'districts', icon: MapPin, name: 'Tumanlar', color: '#EC4899' },
  { type: 'marital_status', icon: Home, name: 'Oila holati', color: '#10B981' },
  { type: 'specialties', icon: Briefcase, name: 'Mutaxassisliklar', color: '#EF4444' },
];

function DictionaryDetail({ config, onBack }: { config: DictConfig; onBack: () => void }) {
  const { t } = useTranslation();
  const { data: items, isLoading, error } = useDictionaryItems(config.type);
  const createItem = useCreateDictionaryItem();
  const updateItem = useUpdateDictionaryItem();
  const deleteItem = useDeleteDictionaryItem();

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<DictionaryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DictionaryItem | null>(null);

  const handleSubmit = (data: CreateDictionaryItemDto) => {
    if (editItem) {
      updateItem.mutate(
        { id: editItem.id, type: config.type, data },
        { onSuccess: () => { setFormOpen(false); setEditItem(null); } },
      );
    } else {
      createItem.mutate(
        { type: config.type, data },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  };

  const handleEdit = (item: DictionaryItem) => {
    setEditItem(item);
    setFormOpen(true);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />{t('common.back')}
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: config.color + '18', color: config.color }}>
          <config.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-slate-900">{config.name}</h2>
          <p className="text-sm text-slate-500">{t('admin.entriesCount', { count: items?.length ?? 0 })}</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => { setEditItem(null); setFormOpen(true); }}
        >
          {t('admin.addEntry')}
        </Button>
      </div>

      {error ? (
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      ) : isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="rounded-[14px] border border-border bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">KOD</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">NOMI</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">TARTIB</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-slate-500">HOLAT</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(items ?? []).map((e: DictionaryItem, i: number) => (
                <tr key={e.id} className={`group ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-4 py-3 text-[13px] font-mono text-slate-600">{e.code}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-900 font-medium">{e.name}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600 text-right">{e.sortOrder}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${e.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {e.isActive ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(e)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Tahrirlash"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(e)}
                        className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        title="O'chirish"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DictionaryItemForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
        onSubmit={handleSubmit}
        item={editItem}
        loading={createItem.isPending || updateItem.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteItem.mutate(
            { id: deleteTarget.id, type: config.type },
            { onSuccess: () => setDeleteTarget(null) },
          );
        }}
        title={t('admin.deleteEntry')}
        message={t('admin.deleteEntryConfirm', { name: deleteTarget?.name })}
        confirmLabel={t('common.delete')}
        variant="danger"
        loading={deleteItem.isPending}
      />
    </div>
  );
}

export function ReferencesPage() {
  const { t } = useTranslation();
  const [activeConfig, setActiveConfig] = useState<DictConfig | null>(null);

  return (
    <PageContent>
      <PageHeader
        title={activeConfig ? activeConfig.name : t('admin.referencesTitle')}
        subtitle={activeConfig ? undefined : t('admin.referencesSubtitle')}
        breadcrumbs={[
          { label: t('nav.admin') },
          { label: t('nav.references'), path: activeConfig ? '/references' : undefined },
          ...(activeConfig ? [{ label: activeConfig.name }] : []),
        ]}
      />

      {activeConfig ? (
        <DictionaryDetail config={activeConfig} onBack={() => setActiveConfig(null)} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DICT_CONFIGS.map((d) => (
            <button key={d.type} onClick={() => setActiveConfig(d)}
              className="rounded-[14px] border border-border bg-white p-5 text-left transition-all hover:shadow-md cursor-pointer">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-xl mb-3.5" style={{ backgroundColor: d.color + '18', color: d.color }}>
                <d.icon className="h-[22px] w-[22px]" />
              </div>
              <p className="text-[15px] font-semibold text-slate-900 mb-1">{d.name}</p>
            </button>
          ))}
        </div>
      )}
    </PageContent>
  );
}
