"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { PageHeading } from "@/components/layout/page-heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { useUploadFeedback } from "@/hooks/use-feedback-api";
import { useWorkspace } from "@/hooks/use-workspace";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { UploadResult } from "@/types/api";

type UploadFormValues = {
  file: FileList;
};

export default function UploadPage() {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [result, setResult] = React.useState<UploadResult | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const { addUpload } = useWorkspace();
  const { notify } = useToast();
  const {
    formState: { errors },
    handleSubmit,
    register,
    setError,
    clearErrors,
  } = useForm<UploadFormValues>();
  const fileField = register("file", {
    validate: () => Boolean(selectedFile) || "Select a CSV file to upload.",
  });
  const uploadMutation = useUploadFeedback(setUploadProgress);

  const chooseFile = (file?: File | null) => {
    setResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validType =
      file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");

    if (!validType) {
      setSelectedFile(null);
      setError("file", {
        message: "Upload a valid CSV file.",
      });
      return;
    }

    clearErrors("file");
    setSelectedFile(file);
  };

  const onSubmit = async () => {
    if (!selectedFile) {
      setError("file", {
        message: "Select a CSV file to upload.",
      });
      return;
    }

    setUploadProgress(0);

    try {
      const upload = await uploadMutation.mutateAsync(selectedFile);

      setResult(upload);
      addUpload({
        ...upload,
        fileName: selectedFile.name,
      });
      notify({
        title: "CSV uploaded",
        description: `${upload.totalRecords} feedback records were stored.`,
        tone: "success",
      });
    } catch (error) {
      notify({
        title: "Upload failed",
        description: getApiErrorMessage(error),
        tone: "error",
      });
    }
  };

  return (
    <div>
      <PageHeading
        description="Upload a customer feedback CSV. Each row is validated and stored as a feedback record for AI theme generation."
        title="Upload CSV"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Feedback file</CardTitle>
            <CardDescription>
              Use a CSV with feedback text, source, user type, product area,
              feedback date, and optional rating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <input
                accept=".csv,text/csv"
                className="sr-only"
                type="file"
                {...fileField}
                onChange={(event) => {
                  fileField.onChange(event);
                  chooseFile(event.target.files?.[0]);
                }}
                ref={(element) => {
                  fileField.ref(element);
                  fileInputRef.current = element;
                }}
              />

              <button
                className={cn(
                  "flex min-h-72 w-full flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center transition-colors duration-150 hover:border-blue-300 hover:bg-blue-50/40",
                  dragging && "border-blue-400 bg-blue-50"
                )}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragging(false);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  chooseFile(event.dataTransfer.files[0]);
                }}
                type="button"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600">
                  <Upload className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-base font-semibold text-zinc-950">
                  Drop your CSV here
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Choose a customer feedback export to create a new analysis
                  batch.
                </p>
                <span className="mt-5 inline-flex h-9 items-center rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm">
                  Browse files
                </span>
              </button>

              {selectedFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-950">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : null}

              {errors.file?.message ? (
                <p className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.file.message}
                </p>
              ) : null}

              {uploadMutation.isPending ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-zinc-500">
                    Uploading feedback records...
                  </p>
                </div>
              ) : null}

              {result ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                    <div>
                      <p className="text-sm font-medium text-emerald-900">
                        Upload complete
                      </p>
                      <p className="mt-1 text-sm leading-6 text-emerald-700">
                        Batch {result.batchId} contains {result.totalRecords}{" "}
                        feedback records.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {result ? (
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/themes?batchId=${result.batchId}`}>
                      Review themes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
                <Button
                  className="w-full sm:w-auto"
                  disabled={uploadMutation.isPending}
                  type="submit"
                >
                  <Upload className="h-4 w-4" />
                  {uploadMutation.isPending ? "Uploading" : "Upload CSV"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV columns</CardTitle>
            <CardDescription>
              These column names match the backend parser.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {[
                "feedbackText",
                "source",
                "userType",
                "productArea",
                "feedbackDate",
                "rating",
              ].map((column) => (
                <div
                  className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2"
                  key={column}
                >
                  <span className="font-mono text-xs text-zinc-700">
                    {column}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {column === "rating" ? "Optional" : "Required"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
