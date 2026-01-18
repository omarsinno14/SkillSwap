import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  avatar: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } }).onUploadComplete(() => {
    return { uploaded: true };
  }),
  proof: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).onUploadComplete(() => {
    return { uploaded: true };
  })
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
