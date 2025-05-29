// shadcn
import { Button } from "@/components/ui/button"

// i18n
import { useTranslation } from "react-i18next";

// Utils
import { LANGUAGES } from "@/components/LanguageToggle/settings";

const LanguageToggle = () => {

  // i18n
  const { t, i18n } = useTranslation();

  // Handlers
  const handleLanguageChange = () => {
    if (!LANGUAGES || LANGUAGES.length === 0) {
      return;
    }

    const currentLang = i18n.resolvedLanguage;
    const currentLangIndex = LANGUAGES.indexOf(currentLang);

    if (currentLangIndex === -1) {
      i18n.changeLanguage(LANGUAGES[0]);
      return;
    }

    const nextLangIndex = (currentLangIndex + 1) % LANGUAGES.length;
    const nextLang = LANGUAGES[nextLangIndex];
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button 
      size="sm" 
      className="h-9 min-w-12 shadow-xl/20 rounded-sm"
      onClick={handleLanguageChange}
      disabled={!LANGUAGES || LANGUAGES.length === 0}
    >
      <span className="text-sm font-bold">{i18n.resolvedLanguage.toUpperCase()}</span>
    </Button>
  )
}

export default LanguageToggle;