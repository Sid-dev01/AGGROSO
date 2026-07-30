"use client";

import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  FileText,
  FolderOpen,
  Layers3,
  Search,
  Upload,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { getUploadDateLabel, matchesUploadSearch } from "@/lib/uploads";
import { useWorkspace } from "@/hooks/use-workspace";

export default function DashboardPage() {
  const { activeBatchId, reports, uploads } = useWorkspace();
  const [uploadSearch, setUploadSearch] = React.useState("");
  const [appliedUploadSearch, setAppliedUploadSearch] = React.useState("");
  const totalFeedback = uploads.reduce(
    (sum, upload) => sum + upload.totalRecords,
    0
  );
  const visibleUploads = appliedUploadSearch
    ? uploads.filter((upload) => matchesUploadSearch(upload, appliedUploadSearch))
    : uploads.slice(0, 10);

  return (
    <div>
      <PageHeading
        actions={
          <Button asChild>
            <Link href="/upload">
              <Upload className="h-4 w-4" />
              Upload CSV
            </Link>
          </Button>
        }
        description="Monitor the customer feedback pipeline from upload through theme review and management reporting."
        title="Dashboard"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          detail="CSV batches captured in this browser"
          icon={FolderOpen}
          label="Recent uploads"
          value={String(uploads.length)}
        />
        <StatCard
          detail="Rows processed from uploaded CSV files"
          icon={Layers3}
          label="Feedback records"
          value={String(totalFeedback)}
        />
        <StatCard
          detail={activeBatchId ? "Ready for review or reporting" : "Upload a CSV to begin"}
          icon={BarChart3}
          label="Active batch"
          value={activeBatchId ? "Selected" : "None"}
        />
        <StatCard
          detail="Reports generated from approved themes"
          icon={FileText}
          label="Reports"
          value={String(reports.length)}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Recent uploads</CardTitle>
            <CardDescription>
              The latest feedback files ready for theme review and reporting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploads.length ? (
              <div className="space-y-4">
                <form
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setAppliedUploadSearch(uploadSearch);
                  }}
                >
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    <Input
                      className="pl-9"
                      onChange={(event) => setUploadSearch(event.target.value)}
                      placeholder="Search uploaded files"
                      value={uploadSearch}
                    />
                  </div>
                  <Button className="w-full sm:w-auto" type="submit">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </form>

                {visibleUploads.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Uploaded</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleUploads.map((upload) => (
                        <TableRow key={upload.batchId}>
                          <TableCell className="font-medium text-zinc-950">
                            {upload.fileName}
                          </TableCell>
                          <TableCell>{upload.totalRecords}</TableCell>
                          <TableCell>{getUploadDateLabel(upload)}</TableCell>
                          <TableCell className="text-right">
                            <Button asChild size="sm" variant="secondary">
                              <Link href={`/themes?batchId=${upload.batchId}`}>
                                Review
                                <ArrowRight className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState
                    className="min-h-48"
                    description="No uploaded files match your search."
                    icon={Search}
                    title="No uploads found"
                  />
                )}
              </div>
            ) : (
              <EmptyState
                action={
                  <Button asChild>
                    <Link href="/upload">
                      <Upload className="h-4 w-4" />
                      Upload CSV
                    </Link>
                  </Button>
                }
                description="Upload a customer feedback CSV to create a batch and begin theme generation."
                icon={Upload}
                title="No uploads yet"
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Continue the workflow from the current batch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuickAction
                description="Store a fresh CSV feedback batch."
                href="/upload"
                icon={Upload}
                label="Upload feedback"
              />
              <QuickAction
                description="Approve, reject, or edit generated themes."
                href={activeBatchId ? `/themes?batchId=${activeBatchId}` : "/themes"}
                icon={BarChart3}
                label="Review themes"
              />
              <QuickAction
                description="Create a management report from approved themes."
                href={activeBatchId ? `/reports?batchId=${activeBatchId}` : "/reports"}
                icon={FileText}
                label="Generate report"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Latest generated reports in this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length ? (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <Link
                      className="block rounded-md border border-zinc-200 p-3 transition-colors duration-150 hover:bg-zinc-50"
                      href={`/reports?batchId=${report.batchId}`}
                      key={report.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-950">
                            {uploads.find((upload) => upload.batchId === report.batchId)
                              ?.fileName ?? "Generated report"}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatDateTime(report.createdAt)}
                          </p>
                        </div>
                        <Badge variant="blue">{report.sentiment}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  className="min-h-48"
                  description="Generate a report after at least one theme has been approved."
                  icon={FileText}
                  title="No reports yet"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  description,
  href,
  icon: Icon,
  label,
}: {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      className="flex items-center gap-3 rounded-md border border-zinc-200 p-3 transition-colors duration-150 hover:bg-zinc-50"
      href={href}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-950">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 text-zinc-400" />
    </Link>
  );
}
