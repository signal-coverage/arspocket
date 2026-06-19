"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { GlobeIcon, CheckIcon } from "lucide-react";
import { setLocale } from "@/app/actions/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { Button } from "@/components/ui";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SettingsModal = ({ open, onOpenChange }: Props) => {
  const t = useTranslations("settings");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: "en" | "es") => {
    startTransition(async () => {
      await setLocale(newLocale);
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-2">
          {/* Language */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <GlobeIcon className="size-4 text-muted-foreground" />
              <p className="text-sm font-medium">{t("language")}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("languageDescription")}
            </p>
            <div className="flex gap-2">
              {(["en", "es"] as const).map((lang) => (
                <Button
                  key={lang}
                  variant={locale === lang ? "default" : "outline"}
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleLocaleChange(lang)}
                  className="flex-1 gap-2"
                >
                  {locale === lang && <CheckIcon className="size-3.5" />}
                  {lang === "en" ? t("english") : t("spanish")}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
