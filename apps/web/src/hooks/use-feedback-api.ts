"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateReport,
  generateThemes,
  getReport,
  getThemes,
  updateTheme,
  uploadFeedback,
} from "@/lib/api";
import type { ThemeUpdate } from "@/types/api";

export function useUploadFeedback(onProgress: (progress: number) => void) {
  return useMutation({
    mutationFn: (file: File) => uploadFeedback(file, onProgress),
  });
}

export function useThemes(batchId?: string) {
  return useQuery({
    queryKey: ["themes", batchId],
    queryFn: () => getThemes(batchId ?? ""),
    enabled: Boolean(batchId),
  });
}

export function useGenerateThemes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => generateThemes(batchId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["themes", result.batchId],
      });
    },
  });
}

export function useUpdateTheme(batchId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      themeId,
      updates,
    }: {
      themeId: string;
      updates: ThemeUpdate;
    }) => updateTheme(themeId, updates),
    onSuccess: () => {
      if (batchId) {
        queryClient.invalidateQueries({
          queryKey: ["themes", batchId],
        });
      }
    },
  });
}

export function useReport(batchId?: string) {
  return useQuery({
    queryKey: ["report", batchId],
    queryFn: () => getReport(batchId ?? ""),
    enabled: Boolean(batchId),
    retry: false,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (batchId: string) => generateReport(batchId),
    onSuccess: (report) => {
      queryClient.setQueryData(["report", report.batchId], report);
    },
  });
}
