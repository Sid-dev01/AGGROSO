"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FileText,
  Lightbulb,
  ListChecks,
  LoaderCircle,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  useGenerateReport,
  useReport,
} from "@/hooks/use-feedback-api";
import { useWorkspace } from "@/hooks/use-workspace";
import { getApiErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import {
  getUploadDateLabel,
  getUploadLabel,
  matchesUploadSearch,
  resolveUploadSearch,
} from "@/lib/uploads";
import type {
  ManagementReport,
  ReportPriority,
  ReportSentiment,
} from "@/types/api";

type ReportForm = {
  searchId: string;
};

export default function ReportsPage() {
  return (
    <React.Suspense fallback={<ReportsFallback />}>
      <ReportsContent />
    </React.Suspense>
  );
}

function ReportsContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batchId") ?? "";
  const { activeBatchId, addReport, setActiveBatchId, uploads } = useWorkspace();
  const [batchId, setBatchId] = React.useState(batchIdFromUrl || activeBatchId);
  const { notify } = useToast();
  const reportQuery = useReport(batchId);
  const generateReportMutation = useGenerateReport();
  const form = useForm<ReportForm>({
    defaultValues: {
      searchId: batchId,
    },
  });
  const uploadSearch = form.watch("searchId") ?? "";
  const selectedUpload = uploads.find((upload) => upload.batchId === batchId);
  const filteredUploads = uploads
    .filter((upload) => matchesUploadSearch(upload, uploadSearch))
    .slice(0, 5);

  React.useEffect(() => {
    if (batchIdFromUrl) {
      const upload = uploads.find((item) => item.batchId === batchIdFromUrl);

      setBatchId(batchIdFromUrl);
      setActiveBatchId(batchIdFromUrl);
      form.setValue(
        "searchId",
        upload ? getUploadLabel(upload) : batchIdFromUrl
      );
    }
  }, [batchIdFromUrl, form, setActiveBatchId, uploads]);

  const submitBatch = (values: ReportForm) => {
    const searchId = values.searchId.trim();
    const upload = resolveUploadSearch(uploads, searchId);
    const nextBatchId = upload?.batchId ?? searchId;

    setBatchId(nextBatchId);
    setActiveBatchId(nextBatchId);

    if (upload) {
      form.setValue("searchId", getUploadLabel(upload));
    }
  };

  const generateBatchReport = async () => {
    if (!batchId) {
      return;
    }

    try {
      const report = await generateReportMutation.mutateAsync(batchId);

      addReport(report);
      notify({
        title: "Report generated",
        description: "The management report is ready for review.",
        tone: "success",
      });
    } catch (error) {
      notify({
        title: "Report generation failed",
        description: getApiErrorMessage(error),
        tone: "error",
      });
    }
  };

  const report = generateReportMutation.data ?? reportQuery.data;

  return (
    <div>
      <PageHeading
        actions={
          <Button
            disabled={!batchId || generateReportMutation.isPending}
            onClick={generateBatchReport}
          >
            {generateReportMutation.isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generateReportMutation.isPending ? "Generating" : "Generate report"}
          </Button>
        }
        description="Create and read management reports generated from approved themes only."
        title="Report"
      />

      <Card className="mb-6">
        <CardContent className="p-5">
          <form className="space-y-3" onSubmit={form.handleSubmit(submitBatch)}>
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <Label htmlFor="reportSearch">Search uploads</Label>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    autoComplete="off"
                    className="pl-9"
                    id="reportSearch"
                    placeholder="Search by file name, upload date, or batch ID"
                    {...form.register("searchId", {
                      required: "Select or enter an upload.",
                    })}
                  />
                </div>
              </div>
              <Button className="w-full md:w-auto" type="submit">
                <Search className="h-4 w-4" />
                Load report
              </Button>
            </div>
            {selectedUpload ? (
              <p className="text-xs text-zinc-500">
                Selected {selectedUpload.fileName} from{" "}
                {getUploadDateLabel(selectedUpload)}
              </p>
            ) : null}
            {uploads.length ? (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {filteredUploads.map((upload) => (
                  <button
                    className="rounded-md border border-zinc-200 px-3 py-2 text-left transition-colors duration-150 hover:border-blue-200 hover:bg-blue-50/40"
                    key={upload.batchId}
                    onClick={() => {
                      setBatchId(upload.batchId);
                      setActiveBatchId(upload.batchId);
                      form.setValue("searchId", getUploadLabel(upload));
                    }}
                    type="button"
                  >
                    <span className="block truncate text-sm font-medium text-zinc-950">
                      {upload.fileName}
                    </span>
                    <span className="mt-1 block truncate text-xs text-zinc-500">
                      {getUploadDateLabel(upload)} -{" "}
                      {upload.totalRecords} records
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">
                Uploaded files will appear here after a successful CSV upload.
              </p>
            )}
            {form.formState.errors.searchId?.message ? (
              <p className="text-sm text-red-600">
                {form.formState.errors.searchId.message}
              </p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      {reportQuery.isLoading ? <ReportSkeleton /> : null}

      {!batchId ? (
        <EmptyState
          description="Search for an uploaded file or paste a batch ID to retrieve its report."
          icon={Search}
          title="Select a batch"
        />
      ) : null}

      {batchId && !report && !reportQuery.isLoading ? (
        <EmptyState
          action={
            <Button
              disabled={generateReportMutation.isPending}
              onClick={generateBatchReport}
            >
              <Sparkles className="h-4 w-4" />
              Generate report
            </Button>
          }
          description="No report exists for this batch yet. Approve themes first, then generate a management report."
          icon={FileText}
          title="No report found"
        />
      ) : null}

      {report ? (
        <div className="space-y-6">
          <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardTitle>Executive summary</CardTitle>
                <CardDescription>
                  Generated {formatDateTime(report.createdAt)}
                  {selectedUpload ? ` for ${selectedUpload.fileName}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-8 text-zinc-800">
                  {report.report.executiveSummary}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall sentiment</CardTitle>
                <CardDescription>
                  Customer tone across approved themes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={getSentimentTone(report.report.overallSentiment)}>
                  {report.report.overallSentiment}
                </Badge>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <ReportList
              icon={ListChecks}
              items={report.report.keyFindings}
              title="Key findings"
            />
            <ReportList
              icon={Lightbulb}
              items={report.report.recommendations}
              title="Recommendations"
            />
          </section>

          <ThemeAnalysis report={report.report} />
        </div>
      ) : null}
    </div>
  );
}

function ReportsFallback() {
  return (
    <div>
      <PageHeading
        description="Create and read management reports generated from approved themes only."
        title="Report"
      />
      <ReportSkeleton />
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function ReportList({
  icon: Icon,
  items,
  title,
}: {
  icon: LucideIcon;
  items: string[];
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-zinc-500" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {items.map((item) => (
            <li
              className="rounded-md border border-zinc-200 bg-white p-3 text-sm leading-6 text-zinc-700"
              key={item}
            >
              {item}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function ThemeAnalysis({ report }: { report: ManagementReport }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-zinc-500" />
          <CardTitle>Theme analysis</CardTitle>
        </div>
        <CardDescription>
          Priority areas returned by the report generator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {report.priorityAreas.map((area) => (
            <div
              className="rounded-lg border border-zinc-200 p-4"
              key={`${area.theme}-${area.priority}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-zinc-950">
                      {area.theme}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {area.reason}
                  </p>
                </div>
                <Badge variant={getPriorityTone(area.priority)}>
                  {area.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getSentimentTone(
  sentiment: ReportSentiment
): "green" | "amber" | "red" {
  if (sentiment === "Positive") {
    return "green";
  }

  if (sentiment === "Negative") {
    return "red";
  }

  return "amber";
}

function getPriorityTone(priority: ReportPriority): "green" | "amber" | "red" {
  if (priority === "Low") {
    return "green";
  }

  if (priority === "High") {
    return "red";
  }

  return "amber";
}
