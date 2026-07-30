"use client";

import * as React from "react";
import type { ReportRecord, UploadResult } from "@/types/api";

type UploadHistoryItem = UploadResult & {
  fileName: string;
  uploadedAt: string;
};

type ReportHistoryItem = {
  id: string;
  batchId: string;
  createdAt: string;
  sentiment: string;
};

type WorkspaceState = {
  activeBatchId: string;
  uploads: UploadHistoryItem[];
  reports: ReportHistoryItem[];
};

const defaultState: WorkspaceState = {
  activeBatchId: "",
  uploads: [],
  reports: [],
};

const storageKey = "feedbackos.workspace";

export function useWorkspace() {
  const [state, setState] = React.useState<WorkspaceState>(defaultState);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const value = window.localStorage.getItem(storageKey);

    if (value) {
      try {
        setState(JSON.parse(value));
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setReady(true);
  }, []);

  React.useEffect(() => {
    if (ready) {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [ready, state]);

  const setActiveBatchId = React.useCallback((batchId: string) => {
    setState((current) => ({
      ...current,
      activeBatchId: batchId,
    }));
  }, []);

  const addUpload = React.useCallback(
    (upload: UploadResult & { fileName: string }) => {
      setState((current) => ({
        ...current,
        activeBatchId: upload.batchId,
        uploads: [
          {
            ...upload,
            uploadedAt: new Date().toISOString(),
          },
          ...current.uploads.filter((item) => item.batchId !== upload.batchId),
        ].slice(0, 8),
      }));
    },
    []
  );

  const addReport = React.useCallback((report: ReportRecord) => {
    setState((current) => ({
      ...current,
      activeBatchId: report.batchId,
      reports: [
        {
          id: report.id,
          batchId: report.batchId,
          createdAt: report.createdAt,
          sentiment: report.report.overallSentiment,
        },
        ...current.reports.filter((item) => item.id !== report.id),
      ].slice(0, 8),
    }));
  }, []);

  return {
    ...state,
    ready,
    setActiveBatchId,
    addUpload,
    addReport,
  };
}
