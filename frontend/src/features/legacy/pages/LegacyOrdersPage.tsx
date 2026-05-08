import { StubPage } from '@/components/layout/StubPage';
import { FileText } from 'lucide-react';

export function LegacyOrdersPage() {
  return (
    <StubPage
      title="Buyruqlar (eski)"
      subtitle="Bu modul yangi HR moduliga ko'chirilmoqda. Yangi versiyani /hr/orders sahifasida ko'ring."
      breadcrumbs={[{ label: 'Eski tizim' }, { label: 'Buyruqlar' }]}
      icon={<FileText className="h-8 w-8 text-slate-400" />}
      items={[
        { label: 'Ish bilan ta\'minlash buyruqlari', description: 'Qabul qilish, bo\'shatish' },
        { label: 'Ta\'til buyruqlari', description: 'Mehnat, o\'quv ta\'tillari' },
        { label: 'Mukofotlash buyruqlari', description: 'Bonus va mukofotlar' },
      ]}
    />
  );
}
