import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsContent } from "@/components/settings/settings-content";

export const metadata: Metadata = { title: "Settings — ARSPocket" };

const SettingsPage = async () => {
  const t = await getTranslations("settings");

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">{t("title")}</h1>
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">{t("language")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
