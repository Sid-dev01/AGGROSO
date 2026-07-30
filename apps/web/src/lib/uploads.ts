import { formatDate, formatDateTime } from "@/lib/format";

export type UploadOption = {
  batchId: string;
  fileName: string;
  totalRecords: number;
  uploadedAt?: string;
};

export function getUploadDateLabel(upload: UploadOption) {
  return upload.uploadedAt
    ? formatDateTime(upload.uploadedAt)
    : "Upload date unavailable";
}

export function getUploadLabel(upload: UploadOption) {
  return `${upload.fileName} - ${getUploadDateLabel(upload)}`;
}

export function matchesUploadSearch(upload: UploadOption, query: string) {
  const search = query.trim().toLowerCase();

  if (!search) {
    return true;
  }

  return [
    upload.fileName,
    upload.batchId,
    upload.uploadedAt ? formatDate(upload.uploadedAt) : "",
    upload.uploadedAt ? formatDateTime(upload.uploadedAt) : "",
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
}

export function resolveUploadSearch(uploads: UploadOption[], query: string) {
  const search = query.trim().toLowerCase();

  return (
    uploads.find((upload) => getUploadLabel(upload).toLowerCase() === search) ??
    uploads.find((upload) => upload.batchId.toLowerCase() === search) ??
    uploads.find((upload) => matchesUploadSearch(upload, query))
  );
}
