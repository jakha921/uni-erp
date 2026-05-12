import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Paperclip, Send, MoreHorizontal } from 'lucide-react';
import { PageContent, PageHeader } from '@/components/layout';
import { AlertBanner, Button, Spinner } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';
import { useThreads, useMessages, useSendMessage } from '@/api/hooks/useMessages';

export function MessagesPage() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const { data: threads, isLoading: threadsLoading, error } = useThreads();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedId ?? 0);
  const sendMessage = useSendMessage();

  const threadList = threads ?? [];
  const filteredThreads = searchQuery
    ? threadList.filter((t) => t.participantNames.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())))
    : threadList;

  const current = threadList.find((t) => t.id === selectedId);
  const currentName = current?.participantNames[0] ?? '';
  const currentMessages = messages ?? [];

  if (error) {
    return (
      <PageContent>
        <AlertBanner variant="error" title={t('errors.unexpected')} message={(error as Error).message} />
      </PageContent>
    );
  }

  if (selectedId === null && threadList.length > 0 && threadList[0]) {
    setSelectedId(threadList[0].id);
  }

  const handleSend = () => {
    if (!newMessage.trim() || selectedId === null) return;
    sendMessage.mutate({ threadId: selectedId, content: newMessage.trim() });
    setNewMessage('');
  };

  return (
    <PageContent>
      <PageHeader title="Xabarlar" subtitle="Ichki yozishmalar va guruh chatlari" breadcrumbs={[{ label: 'Operatsiyalar' }, { label: 'Xabarlar' }]} />

      <div className="flex overflow-hidden rounded-xl border border-border bg-white" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex w-80 flex-col border-r border-border">
          <div className="border-b border-slate-100 p-3.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Qidirish..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[34px] w-full rounded-lg border border-border bg-[#F8FAFB] pl-8 pr-3 text-[12.5px] placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {threadsLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              filteredThreads.map((t) => (
                <button key={t.id} onClick={() => setSelectedId(t.id)}
                  className={cn('flex w-full items-center gap-2.5 border-b border-[#F8FAFB] px-3.5 py-3 text-left transition-colors',
                    selectedId === t.id ? 'border-l-[3px] border-l-primary-500 bg-green-50/70' : 'border-l-[3px] border-l-transparent hover:bg-slate-50')}>
                  <div className="relative shrink-0">
                    <Avatar name={t.participantNames[0] ?? ''} size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline">
                      <span className="flex-1 truncate text-[12.5px] font-semibold text-slate-900">{t.participantNames.join(', ')}</span>
                      <span className="ml-1.5 shrink-0 text-[10.5px] text-slate-400">{t.lastMessageDate ? new Date(t.lastMessageDate).toLocaleDateString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="flex-1 truncate text-[11.5px] text-muted">{t.lastMessage}</span>
                      {t.unreadCount > 0 && (
                        <span className="shrink-0 rounded-full bg-primary-500 px-1.5 py-px text-[10px] font-bold tabular-nums text-white">{t.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-slate-100 px-[18px] py-3">
            <Avatar name={currentName} size="sm" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{currentName}</p>
            </div>
            <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"><Search className="h-4 w-4" /></button>
            <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-[#F8FAFB] p-5">
            {messagesLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              currentMessages.map((m) => (
                <div key={m.id} className={cn('flex', m.senderName === 'Siz' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[70%] px-3.5 py-2.5 shadow-sm',
                    m.senderName === 'Siz' ? 'rounded-[14px_14px_4px_14px] bg-primary-500 text-white' : 'rounded-[14px_14px_14px_4px] bg-white text-slate-900')}>
                    {m.senderName !== 'Siz' && <p className="text-[11px] font-semibold mb-1 opacity-70">{m.senderName}</p>}
                    <p className="text-[13px] leading-relaxed">{m.content}</p>
                    <p className={cn('mt-1 text-right text-[10px]', m.senderName === 'Siz' ? 'opacity-70' : 'text-slate-400')}>
                      {new Date(m.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2.5 border-t border-slate-100 px-3.5 py-3">
            <button className="rounded-md p-2 text-slate-400 hover:bg-slate-100"><Paperclip className="h-4 w-4" /></button>
            <input type="text" placeholder="Xabar yozing..." value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="h-10 flex-1 rounded-[10px] border border-border bg-[#F8FAFB] px-3.5 text-[13px] placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            <Button size="sm" leftIcon={<Send className="h-3.5 w-3.5" />} onClick={handleSend} loading={sendMessage.isPending}>Yuborish</Button>
          </div>
        </div>
      </div>
    </PageContent>
  );
}
