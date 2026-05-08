import { StubPage } from '@/components/layout/StubPage';
import { ScrollText } from 'lucide-react';

export function PatentsPage() {
  return (
    <StubPage
      title="Patentlar"
      subtitle="Intellektual mulk va patentlar boshqaruvi"
      icon={<ScrollText className="h-8 w-8 text-slate-400" />}
      breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Patentlar' }]}
      items={[
        { label: "Ro'yxatdan o'tgan", description: "Tasdiqlangan patentlar ro'yxati" },
        { label: "Ko'rib chiqilmoqda", description: "Ariza berilgan patentlar" },
        { label: 'Litsenziyalar', description: 'Litsenziya shartnomalari' },
      ]}
    />
  );
}
