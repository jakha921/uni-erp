import { StubPage } from '@/components/layout/StubPage';
import { Users } from 'lucide-react';

export function StaffingPage() {
  return (
    <StubPage
      title="Shtatlash jadvali"
      subtitle="Xodimlar shtati va lavozimlar jadvali. Bu modul ishlab chiqilmoqda."
      breadcrumbs={[{ label: 'Eski tizim' }, { label: 'Shtatlash jadvali' }]}
      icon={<Users className="h-8 w-8 text-slate-400" />}
      items={[
        { label: 'Shtat birliklari', description: 'Lavozimlar va shtat o\'rinlari' },
        { label: 'Bo\'sh o\'rinlar', description: 'Vakant lavozimlar ro\'yxati' },
        { label: 'Shtatlash hisoboti', description: 'Band va bo\'sh o\'rinlar tahlili' },
      ]}
    />
  );
}
