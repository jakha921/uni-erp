import { useState } from 'react';
import { Globe, Moon, Sun, Bell, Shield } from 'lucide-react';
import { PageHeader, PageContent } from '@/components/layout';
import { Card } from '@/components/data-display/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { useAppStore } from '@/stores/app.store';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const { i18n } = useTranslation();
  const { lang, setLang, theme, setTheme } = useAppStore();

  const LANGUAGES = [
    { code: 'uz' as const, label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru' as const, label: 'Русский', flag: '🇷🇺' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  ];

  const handleLangChange = (code: 'uz' | 'ru' | 'en') => {
    setLang(code);
    void i18n.changeLanguage(code);
  };

  return (
    <PageContent className="space-y-4">
      <PageHeader
        title="Sozlamalar"
        breadcrumbs={[{ label: 'Sozlamalar' }]}
      />

      <div className="max-w-2xl space-y-4">
        {/* Language */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Til</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLangChange(l.code)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    lang === l.code
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-border text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Theme */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Mavzu</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'light' as const, label: 'Yorug\'', icon: Sun },
                { key: 'dark' as const, label: 'Qorong\'i', icon: Moon },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    theme === t.key
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-border text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Bildirishnomalar</h3>
            </div>
            <div className="space-y-3">
              <SettingRow
                label="Email bildirishnomalar"
                description="Muhim o'zgarishlar haqida email orqali xabardor bo'ling"
                initialChecked
              />
              <SettingRow
                label="To'lov eslatmalari"
                description="Kontrakt to'lov muddatlari yaqinlashganda eslatma"
                initialChecked
              />
              <SettingRow
                label="Tizim yangilanishlari"
                description="Yangi funksiyalar va o'zgarishlar haqida"
              />
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-900">Xavfsizlik</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">Parolni o&apos;zgartirish</p>
                  <p className="text-xs text-muted">Oxirgi o&apos;zgartirilgan: 30 kun oldin</p>
                </div>
                <Button variant="secondary" size="sm">O&apos;zgartirish</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-slate-900">Ikki bosqichli autentifikatsiya</p>
                  <p className="text-xs text-muted">Qo&apos;shimcha xavfsizlik uchun 2FA yoqing</p>
                </div>
                <Button variant="secondary" size="sm">Yoqish</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageContent>
  );
}

function SettingRow({
  label,
  description,
  initialChecked = false,
}: {
  label: string;
  description: string;
  initialChecked?: boolean;
}) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <Toggle checked={checked} onChange={setChecked} />
    </div>
  );
}
