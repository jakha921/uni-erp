import { StubPage } from '@/components/layout/StubPage';
import { Presentation } from 'lucide-react';

export function ConferencesPage() {
  return (
    <StubPage
      title="Konferensiyalar"
      subtitle="Ilmiy konferensiyalar va tadbirlarni boshqarish"
      icon={<Presentation className="h-8 w-8 text-slate-400" />}
      breadcrumbs={[{ label: 'Ilm-fan' }, { label: 'Konferensiyalar' }]}
      items={[
        { label: 'Rejalashtirilgan', description: "Kelgusi konferensiyalar ro'yxati" },
        { label: "O'tkazilgan", description: "O'tkazilgan tadbirlar arxivi" },
        { label: 'Ishtirokchilar', description: 'Ishtirokchilar statistikasi' },
      ]}
    />
  );
}
