import { StubPage } from '@/components/layout/StubPage';
import { GraduationCap } from 'lucide-react';

export function MyStudentsPage() {
  return (
    <StubPage
      title="Mening talabalarim"
      subtitle="O'qituvchi sifatida sizga biriktirilgan talabalar ro'yxati. Bu modul ishlab chiqilmoqda."
      breadcrumbs={[{ label: "Ta'lim" }, { label: 'Mening talabalarim' }]}
      icon={<GraduationCap className="h-8 w-8 text-slate-400" />}
      items={[
        { label: 'Guruhlarim', description: 'Sizga biriktirilgan guruhlar' },
        { label: 'Baholash', description: 'Talabalarni baholash' },
        { label: 'Davomat', description: 'Dars davomati qaydlari' },
      ]}
    />
  );
}
