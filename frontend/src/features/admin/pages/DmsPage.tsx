import { useState } from 'react';
import { PageContent, PageHeader } from '@/components/layout';
import { StatCard, Card } from '@/components/data-display';
import { Badge, Button, Spinner } from '@/components/ui';
import { ConfirmDialog } from '@/components/overlays';
import {
  Inbox,
  Send,
  FileEdit,
  FileCheck,
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useDocuments, useFolders, useCreateDocument, useUpdateDocument, useDeleteDocument } from '@/api/hooks/useDms';
import { DocumentForm } from '../components/DocumentForm';
import type { Document, DocStatus } from '@/types/admin';
import type { DocumentFormData } from '../schemas/document.schema';

const STATUS_VARIANT: Record<DocStatus, 'info' | 'warning' | 'success' | 'default' | 'error'> = {
  draft: 'default',
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  archived: 'info',
};

const STATUS_LABEL: Record<DocStatus, string> = {
  draft: 'Loyiha',
  pending: "Ko'rib chiqilmoqda",
  approved: 'Imzolangan',
  rejected: 'Rad etilgan',
  archived: 'Arxiv',
};

const PRIORITY_DOT: Record<string, string> = {
  high: 'bg-red-500',
  urgent: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};

const FOLDER_ICONS = {
  inbox: Inbox,
  outbox: Send,
  drafts: FileEdit,
  archive: FileCheck,
};

export function DmsPage() {
  const [activeFolderId, setActiveFolderId] = useState<number | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [editDocument, setEditDocument] = useState<Document | null>(null);
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);

  const { data: foldersData, isLoading: isLoadingFolders } = useFolders();
  const { data: documentsData, isLoading: isLoadingDocs } = useDocuments({ folderId: activeFolderId });

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocumentMutation = useDeleteDocument();

  const folders = foldersData ?? [];
  const documents = documentsData?.data ?? [];
  const totalDocs = documentsData?.total ?? 0;
  const approvedCount = documents.filter((d) => d.status === 'approved').length;
  const pendingCount = documents.filter((d) => d.status === 'pending').length;
  const draftCount = documents.filter((d) => d.status === 'draft').length;

  const handleOpenCreate = () => { setEditDocument(null); setFormOpen(true); };
  const handleClose = () => { setFormOpen(false); setEditDocument(null); };

  const handleSubmit = (data: DocumentFormData) => {
    if (editDocument) {
      updateDocument.mutate({ id: editDocument.id, data }, { onSuccess: handleClose });
    } else {
      createDocument.mutate(data, { onSuccess: handleClose });
    }
  };

  return (
    <PageContent>
      <PageHeader
        title="Hujjat aylanishi"
        subtitle="Elektron hujjat boshqaruv tizimi"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Hujjat aylanishi' }]}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenCreate}>
            Hujjat qo&apos;shish
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <StatCard label="Jami hujjatlar" value={totalDocs} icon={<Inbox className="h-[18px] w-[18px]" />} iconBg="#3B82F6" />
        <StatCard label="Kutilmoqda" value={pendingCount} icon={<Send className="h-[18px] w-[18px]" />} iconBg="#8B5CF6" />
        <StatCard label="Loyihalar" value={draftCount} icon={<FileEdit className="h-[18px] w-[18px]" />} iconBg="#F59E0B" />
        <StatCard label="Imzolangan" value={approvedCount} icon={<FileCheck className="h-[18px] w-[18px]" />} iconBg="#2DB976" />
      </div>

      <DocumentForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        document={editDocument}
        folders={folders}
        loading={createDocument.isPending || updateDocument.isPending}
      />
      <ConfirmDialog
        open={!!deleteDocument}
        onClose={() => setDeleteDocument(null)}
        onConfirm={() => {
          if (!deleteDocument) return;
          deleteDocumentMutation.mutate(deleteDocument.id, { onSuccess: () => setDeleteDocument(null) });
        }}
        title="Hujjatni o'chirish"
        message={`"${deleteDocument?.title}" hujjatni o'chirishni tasdiqlaysizmi?`}
        confirmLabel="O'chirish"
        variant="danger"
        loading={deleteDocumentMutation.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        <Card className="h-fit">
          {isLoadingFolders ? (
            <div className="flex justify-center py-6"><Spinner size="sm" /></div>
          ) : (
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveFolderId(undefined)}
                className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${
                  activeFolderId === undefined
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-slate-600 font-medium hover:bg-slate-50'
                }`}
              >
                <FolderOpen className="h-4 w-4 shrink-0" />
                <span className="flex-1">Hammasi</span>
                <span className={`rounded-full px-1.5 py-px text-[11px] font-semibold ${activeFolderId === undefined ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                  {totalDocs}
                </span>
              </button>
              {folders.map((folder) => {
                const isActive = activeFolderId === folder.id;
                const folderKey = folder.name.toLowerCase() as keyof typeof FOLDER_ICONS;
                const Icon = FOLDER_ICONS[folderKey] ?? FolderOpen;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolderId(folder.id)}
                    className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'text-slate-600 font-medium hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{folder.name}</span>
                    <span className={`rounded-full px-1.5 py-px text-[11px] font-semibold ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                      {folder.documentCount}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card noPadding>
          {isLoadingDocs ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F8FAFB]">
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Raqami</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Muallif</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Mavzu</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Holat</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold text-muted uppercase tracking-[0.05em]">Sana</th>
                    <th className="w-20 px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-12 text-center text-sm text-slate-400">
                        Hujjatlar topilmadi
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc: Document) => (
                      <tr key={doc.id} className="border-b border-[#F8FAFB] hover:bg-[#F8FAFB] transition-colors cursor-pointer">
                        <td className="px-3 py-3">
                          <p className="text-[12.5px] font-semibold text-slate-900">{doc.number}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{doc.category}</p>
                        </td>
                        <td className="px-3 py-3 text-[13px] text-slate-600">{doc.authorName}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[doc.priority] ?? 'bg-slate-400'}`} />
                            <span className="text-[13px] font-medium text-slate-900">{doc.title}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <Badge variant={STATUS_VARIANT[doc.status]} dot>{STATUS_LABEL[doc.status]}</Badge>
                        </td>
                        <td className="px-3 py-3 text-[12.5px] text-slate-500 tabular-nums">{doc.createdAt}</td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => { setEditDocument(doc); setFormOpen(true); }} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setDeleteDocument(doc)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </PageContent>
  );
}
