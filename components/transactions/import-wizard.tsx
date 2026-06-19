"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";
import { Upload, Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const REQUIRED_FIELDS = ["type", "amount", "date"] as const;
const OPTIONAL_FIELDS = ["currency", "description", "category"] as const;
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

type Step = 1 | 2 | 3;

const CSV_TEMPLATE =
  "type,amount,currency,date,description,category\nINCOME,50000,ARS,2026-06-01,Salary,Salary\nOUTCOME,5000,ARS,2026-06-05,Supermarket,Food\n";

export const ImportWizard = () => {
  const t = useTranslations("importWizard");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    errors: Array<{ row: number; error: string }>;
  } | null>(null);

  // Step 1: file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileObj(file);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, meta }) => {
        if (data.length > 500) {
          toast.error(t("fileExceedsLimit", { count: data.length }));
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setHeaders(meta.fields ?? []);
        setRows(data);
        // Auto-map columns by name similarity
        const autoMap: Record<string, string> = {};
        for (const field of ALL_FIELDS) {
          const match = (meta.fields ?? []).find(
            (h) =>
              h.toLowerCase().includes(field.toLowerCase()) ||
              field.toLowerCase().includes(h.toLowerCase()),
          );
          if (match) autoMap[field] = match;
        }
        setColumnMap(autoMap);
        setStep(2);
      },
    });
  };

  // Step 2: column mapping validation
  const canAdvanceStep2 = REQUIRED_FIELDS.every((f) => columnMap[f]);

  // Step 3: preview + import
  const handleImport = async () => {
    if (!fileObj) return;
    setImporting(true);

    const fd = new FormData();
    fd.set("file", fileObj);
    fd.set("columnMap", JSON.stringify(columnMap));

    try {
      const res = await fetch("/api/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? t("importFailed"));
      } else {
        setResult(data);
        toast.success(t("transactionsImported", { count: data.imported }));
      }
    } catch {
      toast.error(t("networkError"));
    } finally {
      setImporting(false);
    }
  };

  const reset = () => {
    setStep(1);
    setHeaders([]);
    setRows([]);
    setColumnMap({});
    setFileObj(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (result) {
    return (
      <div className="space-y-4 text-center py-6">
        <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
        <div>
          <p className="font-semibold">
            {t("transactionsImported", { count: result.imported })}
          </p>
          {result.skipped > 0 && (
            <p className="text-sm text-muted-foreground">
              {t("rowsSkipped", { count: result.skipped })}
            </p>
          )}
        </div>
        {result.errors.length > 0 && (
          <div className="text-left text-xs space-y-1 max-h-40 overflow-auto border rounded p-2">
            {result.errors.map((e) => (
              <p key={e.row} className="text-destructive">
                Row {e.row}: {e.error}
              </p>
            ))}
          </div>
        )}
        <Button onClick={reset} variant="outline" size="sm">
          {t("importAnotherFile")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-2 text-sm">
        {([1, 2, 3] as const).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <span
              className={`size-6 rounded-full flex items-center justify-center text-xs font-medium border ${
                step === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : step > s
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "border-border text-muted-foreground"
              }`}
            >
              {s}
            </span>
            <span
              className={
                step === s ? "font-medium" : "text-muted-foreground text-xs"
              }
            >
              {s === 1 ? t("upload") : s === 2 ? t("mapColumns") : t("preview")}
            </span>
            {s < 3 && <span className="text-border mx-1">›</span>}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="size-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">{t("chooseFile")}</p>
            <p className="text-xs text-muted-foreground mb-4">{t("maxRows")}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              id="csv-upload"
            />
            <Label htmlFor="csv-upload" asChild>
              <Button variant="outline" size="sm" asChild>
                <span className="cursor-pointer">{t("selectFile")}</span>
              </Button>
            </Label>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadTemplate}
            className="gap-1"
          >
            <Download className="size-3.5" /> {t("downloadTemplate")}
          </Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{rows.length}</span>{" "}
              {t("rowsDetected", { count: rows.length })
                .replace(String(rows.length), "")
                .trim()}
            </p>
            <Badge variant="secondary">{fileObj?.name}</Badge>
          </div>

          <div className="space-y-3">
            {ALL_FIELDS.map((field) => {
              const required = REQUIRED_FIELDS.includes(
                field as (typeof REQUIRED_FIELDS)[number],
              );
              return (
                <div key={field} className="flex items-center gap-3">
                  <Label className="w-28 shrink-0 capitalize">
                    {field}
                    {required && (
                      <span className="text-destructive ml-0.5">*</span>
                    )}
                  </Label>
                  <Select
                    value={columnMap[field] ?? "none"}
                    onValueChange={(v) =>
                      setColumnMap((prev) => ({
                        ...prev,
                        [field]: v === "none" ? "" : v,
                      }))
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={t("selectCsvColumn")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("none")}</SelectItem>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
              {t("backBtn")}
            </Button>
            <Button
              size="sm"
              disabled={!canAdvanceStep2}
              onClick={() => setStep(3)}
            >
              {t("previewBtn")}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("previewLabel", { total: rows.length })}
          </p>
          <div className="overflow-auto rounded border">
            <table className="text-xs w-full">
              <thead className="bg-muted">
                <tr>
                  {ALL_FIELDS.filter((f) => columnMap[f]).map((f) => (
                    <th
                      key={f}
                      className="px-3 py-2 text-left capitalize font-medium"
                    >
                      {f}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {ALL_FIELDS.filter((f) => columnMap[f]).map((f) => (
                      <td key={f} className="px-3 py-2 truncate max-w-32">
                        {row[columnMap[f]] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep(2)}>
              {t("backBtn")}
            </Button>
            <Button size="sm" onClick={handleImport} disabled={importing}>
              {importing
                ? t("importing")
                : t("importRows", { count: rows.length })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
