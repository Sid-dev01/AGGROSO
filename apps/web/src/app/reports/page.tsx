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
import type {
  ManagementReport,
  ReportPriority,
  ReportSentiment,
} from "@/types/api";

type ReportForm = {
  batchId: string;
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
  const { activeBatchId, addReport, setActiveBatchId } = useWorkspace();
  const [batchId, setBatchId] = React.useState(batchIdFromUrl || activeBatchId);
  const { notify } = useToast();
  const reportQuery = useReport(batchId);
  const generateReportMutation = useGenerateReport();
  const form = useForm<ReportForm>({
    defaultValues: {
      batchId,
    },
  });

  React.useEffect(() => {
    if (batchIdFromUrl) {
      setBatchId(batchIdFromUrl);
      setActiveBatchId(batchIdFromUrl);
      form.setValue("batchId", batchIdFromUrl);
    }
  }, [batchIdFromUrl, form, setActiveBatchId]);

  const submitBatch = (values: ReportForm) => {
    setBatchId(values.batchId);
    setActiveBatchId(values.batchId);
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
            <Sparkles className="h-4 w-4" />
            {generateReportMutation.isPending ? "Generating" : "Generate report"}
          </Button>
        }
        description="Create and read management reports generated from approved themes only."
        title="Report"
      />

      <Card className="mb-6">
        <CardContent className="p-5">
          <form
            className="flex flex-col gap-3 md:flex-row md:items-end"
            onSubmit={form.handleSubmit(submitBatch)}
          >
            <div className="flex-1">
              <Label htmlFor="reportBatchId">Batch ID</Label>
              <Input
                className="mt-2"
                id="reportBatchId"
                placeholder="Paste an approved batch ID"
                {...form.register("batchId", {
                  required: "Batch ID is required.",
                })}
              />
              {form.formState.errors.batchId?.message ? (
                <p className="mt-2 text-sm text-red-600">
                  {form.formState.errors.batchId.message}
                </p>
              ) : null}
            </div>
            <Button type="submit">
              <Search className="h-4 w-4" />
              Load report
            </Button>
          </form>
        </CardContent>
      </Card>

      {reportQuery.isLoading ? <ReportSkeleton /> : null}

      {!batchId ? (
        <EmptyState
          description="Paste a batch ID to retrieve its latest report or generate one from approved themes."
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
                  Generated {formatDateTime(report.createdAt)} for batch{" "}
                  {report.batchId}
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
