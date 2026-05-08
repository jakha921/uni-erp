import { StubPage } from '@/components/layout/StubPage';
import { Truck } from 'lucide-react';

export function TransportPage() {
  return (
    <StubPage
      title="Transport"
      subtitle="Universitet transport vositalari boshqaruvi"
      icon={<Truck className="h-8 w-8 text-slate-400" />}
      breadcrumbs={[{ label: 'Infratuzilma' }, { label: 'Transport' }]}
      items={[
        { label: 'Avtomobillar', description: "Transport vositalari ro'yxati" },
        { label: "Yo'nalishlar", description: "Kundalik yo'nalishlar" },
        { label: 'Haydovchilar', description: "Haydovchilar ma'lumotlari" },
      ]}
    />
  );
}
