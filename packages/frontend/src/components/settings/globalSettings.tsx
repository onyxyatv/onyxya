import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const langaugeOptions = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
];

const GlobalSettings: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleClick = () => {
    if (selectedLanguage == null) {
      return;
    }
    localStorage.setItem("onyxyaLang", selectedLanguage);
    window.location.reload();
  };

  return (
    <section className="mt-2 p-2 bg-gray-100 border-2 rounded-md border-gray-200">
      <div className="flex flex-row items-center gap-4">
        <h2 className="text-lg font-semibold">{t("hello_world")}</h2>
        <Select onValueChange={(value: string) => setSelectedLanguage(value)}>
          <SelectTrigger className="p-2 rounded-md w-1/3">
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
          <SelectContent>
            {langaugeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleClick}>Save</Button>
      </div>
    </section>
  );
};

export default GlobalSettings;
