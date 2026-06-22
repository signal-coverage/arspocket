"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { SettingsContent } from "./settings-content";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SettingsModal = ({ open, onOpenChange }: Props) => {
  const t = useTranslations("settings");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <SettingsContent onAfterChange={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
