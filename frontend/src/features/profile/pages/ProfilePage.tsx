import { Pencil, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { formatDate } from '@/lib/utils';

export function ProfilePage() {
  const currentUser = useAuthStore((s) => s.currentUser);

  if (!currentUser) return null;

  const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrator',
    buxgalter: 'Buxgalter',
    dekan: 'Dekan',
    oqituvchi: "Professor-o'qituvchi",
    talaba: 'Talaba',
  };

  const roleLabel = ROLE_LABELS[currentUser.role] ?? currentUser.role;

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title="Profil"
        breadcrumbs={[{ label: 'Profil' }]}
        actions={
          <Button leftIcon={<Pencil className="h-4 w-4" />} variant="secondary">
            Tahrirlash
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main profile card */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {currentUser.initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="info">{roleLabel}</Badge>
                  {currentUser.facultyName && (
                    <span className="text-sm text-muted">{currentUser.facultyName}</span>
                  )}
                </div>
                {currentUser.position && (
                  <p className="text-sm text-muted mt-1">{currentUser.position}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={currentUser.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Telefon" value={currentUser.phone} />
              {currentUser.facultyName && (
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Fakultet" value={currentUser.facultyName} />
              )}
              {currentUser.departmentName && (
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Bo'lim" value={currentUser.departmentName} />
              )}
              {currentUser.degree && (
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Ilmiy daraja" value={currentUser.degree} />
              )}
              {currentUser.rank && (
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Ilmiy unvon" value={currentUser.rank} />
              )}
              {currentUser.groupName && (
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Guruh" value={currentUser.groupName} />
              )}
              {currentUser.level && (
                <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Kurs" value={currentUser.level} />
              )}
            </div>
          </div>
        </Card>

        {/* Quick info */}
        <div className="space-y-4">
          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Tizim ma&apos;lumotlari</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">ID</span>
                  <span className="font-mono text-slate-700">{currentUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Rol</span>
                  <span className="text-slate-700">{roleLabel}</span>
                </div>
                {currentUser.employeeId && (
                  <div className="flex justify-between">
                    <span className="text-muted">Xodim ID</span>
                    <span className="font-mono text-slate-700">{currentUser.employeeId}</span>
                  </div>
                )}
                {currentUser.studentId && (
                  <div className="flex justify-between">
                    <span className="text-muted">Talaba ID</span>
                    <span className="font-mono text-slate-700">{currentUser.studentId}</span>
                  </div>
                )}
                {currentUser.studentIdNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted">ID raqami</span>
                    <span className="font-mono text-slate-700">{currentUser.studentIdNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Xavfsizlik</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Parol</span>
                  <Button variant="ghost" size="sm">O&apos;zgartirish</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Oxirgi kirish</span>
                  <span className="text-slate-700">{formatDate(new Date().toISOString())}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContent>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-muted">{icon}</div>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm text-slate-900">{value}</p>
      </div>
    </div>
  );
}
