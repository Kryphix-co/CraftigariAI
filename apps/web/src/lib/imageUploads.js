import { apiUpload } from "@/lib/api";

export async function uploadImageEntries(entries) {
  if (!entries.length) return [];
  const formData = new FormData();
  entries.forEach((entry) => formData.append("images", entry.file));
  const data = await apiUpload("/api/uploads/images", formData);
  if (!Array.isArray(data.images) || data.images.length !== entries.length) {
    throw new Error("The image server returned an incomplete upload result.");
  }
  return data.images;
}
