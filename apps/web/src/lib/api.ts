import axios from "axios";
import type {
  ApiResponse,
  GenerateThemesResult,
  ReportRecord,
  Theme,
  ThemeUpdate,
  UploadResult,
} from "@/types/api";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001",
});

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export async function uploadFeedback(
  file: File,
  onUploadProgress?: (progress: number) => void
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<ApiResponse<UploadResult>>(
    "/upload",
    formData,
    {
      onUploadProgress: (event) => {
        if (!event.total || !onUploadProgress) {
          return;
        }

        onUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    }
  );

  return response.data.data;
}

export async function generateThemes(batchId: string) {
  const response = await api.post<ApiResponse<GenerateThemesResult>>(
    `/themes/generate/${batchId}`,
    {}
  );

  return response.data.data;
}

export async function getThemes(batchId: string) {
  const response = await api.get<ApiResponse<Theme[]>>(`/themes/${batchId}`);

  return response.data.data;
}

export async function updateTheme(themeId: string, updates: ThemeUpdate) {
  const response = await api.patch<ApiResponse<Theme>>(
    `/themes/${themeId}`,
    updates
  );

  return response.data.data;
}

export async function generateReport(batchId: string) {
  const response = await api.post<ApiResponse<ReportRecord>>(
    `/reports/generate/${batchId}`
  );

  return response.data.data;
}

export async function getReport(batchId: string) {
  const response = await api.get<ApiResponse<ReportRecord>>(
    `/reports/${batchId}`
  );

  return response.data.data;
}
