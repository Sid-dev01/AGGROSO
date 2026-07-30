"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Check,
  FileText,
  Pencil,
  Search,
  Sparkles,
  X,
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
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  useGenerateThemes,
  useThemes,
  useUpdateTheme,
} from "@/hooks/use-feedback-api";
import { useWorkspace } from "@/hooks/use-workspace";
import { getApiErrorMessage } from "@/lib/api";
import { formatConfidence, getStatusTone } from "@/lib/format";
import type { Theme, ThemeStatus, ThemeUpdate } from "@/types/api";

type BatchForm = {
  batchId: string;
};

type ThemeForm = {
  title: string;
  problemStatement: string;
};

export default function ThemeReviewPage() {
  return (
    <React.Suspense fallback={<ThemeReviewFallback />}>
      <ThemeReviewContent />
    </React.Suspense>
  );
}

function ThemeReviewContent() {
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batchId") ?? "";
  const { activeBatchId, setActiveBatchId } = useWorkspace();
  const [batchId, setBatchId] = React.useState(batchIdFromUrl || activeBatchId);
  const [editingTheme, setEditingTheme] = React.useState<Theme | null>(null);
  const { notify } = useToast();
  const themesQuery = useThemes(batchId);
  const generateThemesMutation = useGenerateThemes();
  const updateThemeMutation = useUpdateTheme(batchId);
  const batchForm = useForm<BatchForm>({
    defaultValues: {
      batchId,
    },
  });
  const themeForm = useForm<ThemeForm>({
    defaultValues: {
      title: "",
      problemStatement: "",
    },
  });

  React.useEffect(() => {
    if (batchIdFromUrl) {
      setBatchId(batchIdFromUrl);
      setActiveBatchId(batchIdFromUrl);
      batchForm.setValue("batchId", batchIdFromUrl);
    }
  }, [batchForm, batchIdFromUrl, setActiveBatchId]);

  React.useEffect(() => {
    if (editingTheme) {
      themeForm.reset({
        title: editingTheme.title,
        problemStatement: editingTheme.problemStatement,
      });
    }
  }, [editingTheme, themeForm]);

  const submitBatch = (values: BatchForm) => {
    setBatchId(values.batchId);
    setActiveBatchId(values.batchId);
  };

  const generateThemesForBatch = async () => {
    if (!batchId) {
      return;
    }

    try {
      const result = await generateThemesMutation.mutateAsync(batchId);

      notify({
        title: "Themes generated",
        description: `${result.totalThemes} themes were created from ${result.totalFeedback} feedback records.`,
        tone: "success",
      });
    } catch (error) {
      notify({
        title: "Theme generation failed",
        description: getApiErrorMessage(error),
        tone: "error",
      });
    }
  };

  const reviewTheme = async (themeId: string, status: ThemeStatus) => {
    try {
      await updateThemeMutation.mutateAsync({
        themeId,
        updates: {
          status,
        },
      });
      notify({
        title: "Theme updated",
        description: `Theme status changed to ${status.toLowerCase()}.`,
        tone: "success",
      });
    } catch (error) {
      notify({
        title: "Theme update failed",
        description: getApiErrorMessage(error),
        tone: "error",
      });
    }
  };

  const saveTheme = async (values: ThemeForm) => {
    if (!editingTheme) {
      return;
    }

    const updates: ThemeUpdate = {
      title: values.title,
      problemStatement: values.problemStatement,
    };

    try {
      await updateThemeMutation.mutateAsync({
        themeId: editingTheme.id,
        updates,
      });
      setEditingTheme(null);
      notify({
        title: "Theme saved",
        description: "Title and problem statement were updated.",
        tone: "success",
      });
    } catch (error) {
      notify({
        title: "Theme save failed",
        description: getApiErrorMessage(error),
        tone: "error",
      });
    }
  };

  const themes = themesQuery.data ?? [];
  const approvedCount = themes.filter(
    (theme) => theme.status === "APPROVED"
  ).length;
  const pendingCount = themes.filter((theme) => theme.status === "PENDING").length;

  return (
    <div>
      <PageHeading
        actions={
          <Button
            disabled={!batchId || generateThemesMutation.isPending}
            onClick={generateThemesForBatch}
            variant="secondary"
          >
            <Sparkles className="h-4 w-4" />
            {generateThemesMutation.isPending ? "Generating" : "Generate themes"}
          </Button>
        }
        description="Review AI-generated themes before they are used in management reports."
        title="Theme Review"
      />

      <Card className="mb-6">
        <CardContent className="p-5">
          <form
            className="flex flex-col gap-3 md:flex-row md:items-end"
            onSubmit={batchForm.handleSubmit(submitBatch)}
          >
            <div className="flex-1">
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                className="mt-2"
                id="batchId"
                placeholder="Paste a batch ID from your upload"
                {...batchForm.register("batchId", {
                  required: "Batch ID is required.",
                })}
              />
              {batchForm.formState.errors.batchId?.message ? (
                <p className="mt-2 text-sm text-red-600">
                  {batchForm.formState.errors.batchId.message}
                </p>
              ) : null}
            </div>
            <Button className="md:w-auto" type="submit">
              <Search className="h-4 w-4" />
              Load themes
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <ReviewMetric label="Total themes" value={String(themes.length)} />
        <ReviewMetric label="Approved" value={String(approvedCount)} />
        <ReviewMetric label="Pending review" value={String(pendingCount)} />
      </section>

      {themesQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!themesQuery.isLoading && batchId && themes.length === 0 ? (
        <EmptyState
          action={
            <Button
              disabled={generateThemesMutation.isPending}
              onClick={generateThemesForBatch}
            >
              <Sparkles className="h-4 w-4" />
              Generate themes
            </Button>
          }
          description="No themes were returned for this batch. Generate AI themes first, then review them here."
          icon={FileText}
          title="No themes available"
        />
      ) : null}

      {!batchId ? (
        <EmptyState
          description="Paste a batch ID from a completed upload to load generated themes."
          icon={Search}
          title="Select a batch"
        />
      ) : null}

      {themes.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {themes.map((theme) => (
            <ThemeCard
              disabled={updateThemeMutation.isPending}
              key={theme.id}
              onEdit={() => setEditingTheme(theme)}
              onReview={reviewTheme}
              theme={theme}
            />
          ))}
        </div>
      ) : null}

      <Dialog
        description="Update the title or problem statement before reports are generated."
        footer={
          <>
            <Button
              onClick={() => setEditingTheme(null)}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              disabled={updateThemeMutation.isPending}
              form="theme-edit-form"
              type="submit"
            >
              Save changes
            </Button>
          </>
        }
        onOpenChange={(open) => {
          if (!open) {
            setEditingTheme(null);
          }
        }}
        open={Boolean(editingTheme)}
        title="Edit theme"
      >
        <form
          className="space-y-4"
          id="theme-edit-form"
          onSubmit={themeForm.handleSubmit(saveTheme)}
        >
          <div>
            <Label htmlFor="themeTitle">Title</Label>
            <Input
              className="mt-2"
              id="themeTitle"
              {...themeForm.register("title", {
                required: "Theme title is required.",
              })}
            />
            {themeForm.formState.errors.title?.message ? (
              <p className="mt-2 text-sm text-red-600">
                {themeForm.formState.errors.title.message}
              </p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="themeProblem">Problem statement</Label>
            <Textarea
              className="mt-2"
              id="themeProblem"
              {...themeForm.register("problemStatement", {
                required: "Problem statement is required.",
              })}
            />
            {themeForm.formState.errors.problemStatement?.message ? (
              <p className="mt-2 text-sm text-red-600">
                {themeForm.formState.errors.problemStatement.message}
              </p>
            ) : null}
          </div>
        </form>
      </Dialog>
    </div>
  );
}

function ThemeReviewFallback() {
  return (
    <div>
      <PageHeading
        description="Review AI-generated themes before they are used in management reports."
        title="Theme Review"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-2 text-xl font-semibold text-zinc-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function ThemeCard({
  disabled,
  onEdit,
  onReview,
  theme,
}: {
  disabled: boolean;
  onEdit: () => void;
  onReview: (themeId: string, status: ThemeStatus) => void;
  theme: Theme;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">{theme.title}</CardTitle>
            <CardDescription>
              {theme.feedbackCount} linked feedback records
            </CardDescription>
          </div>
          <Badge variant={getStatusTone(theme.status)}>{theme.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-zinc-700">
          {theme.problemStatement}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <span>AI confidence</span>
          <Badge variant="blue">{formatConfidence(theme.aiConfidence)}</Badge>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="sm:flex-1"
            disabled={disabled || theme.status === "APPROVED"}
            onClick={() => onReview(theme.id, "APPROVED")}
            variant="success"
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            className="sm:flex-1"
            disabled={disabled || theme.status === "REJECTED"}
            onClick={() => onReview(theme.id, "REJECTED")}
            variant="destructive"
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button
            className="sm:flex-1"
            disabled={disabled}
            onClick={onEdit}
            variant="secondary"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
