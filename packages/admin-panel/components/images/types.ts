export type UploadStatus = "pending" | "uploading" | "uploaded" | "error";

export interface ImageItem {
  id: string;
  file?: File;
  previewUrl: string;
  key: string;
  publicUrl: string;
  contentType: string;
  size: number;
  order: number;
  status: UploadStatus;
  error?: string;
}
