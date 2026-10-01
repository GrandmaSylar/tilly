"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageSquare, UploadSimple } from "@phosphor-icons/react";
import { cloudinaryUrl } from "@/lib/cloudinary";

const MAX_BYTES = 10 * 1024 * 1024;

type Signature = { signature: string; timestamp: number; folder: string; apiKey: string; cloudName: string };

/**
 * Signed direct-to-Cloudinary upload: the server signs the request, the browser
 * sends the file straight to Cloudinary, and the resulting URL goes into the form.
 */
export function ImageUpload({ name, defaultValue, error }: { name: string; defaultValue?: string; error?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  async function upload(file: File) {
    setLocalError(null);
    if (!file.type.startsWith("image/")) return setLocalError("Choose an image file (JPG, PNG, WebP or HEIC).");
    if (file.size > MAX_BYTES) return setLocalError("That photo is over 10MB. Export a smaller version and try again.");

    setProgress(0);
    try {
      const res = await fetch("/api/admin/cloudinary-sign", { method: "POST" });
      if (!res.ok) throw new Error(res.status === 401 ? "Your session expired. Sign in again." : "Couldn't prepare the upload.");
      const sig: Signature = await res.json();

      const body = new FormData();
      body.append("file", file);
      body.append("api_key", sig.apiKey);
      body.append("timestamp", String(sig.timestamp));
      body.append("folder", sig.folder);
      body.append("signature", sig.signature);

      const secureUrl = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
        xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () => {
          const data = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) resolve(data.secure_url);
          else reject(new Error(data.error?.message ?? "Upload failed."));
        };
        xhr.onerror = () => reject(new Error("Upload failed. Check your connection and try again."));
        xhr.send(body);
      });

      setUrl(secureUrl);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // The server's "upload a photo" error is stale once a new photo is in.
  const shownError = localError ?? (url && url !== defaultValue ? undefined : error);
  const uploading = progress !== null;

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        id={`${name}-file`}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />

      <div
        className={`relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border bg-ice ${shownError ? "border-danger" : "border-line"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
      >
        {url ? (
          <Image src={cloudinaryUrl(url, 640)} alt="Product photo preview" fill sizes="320px" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center p-6 text-center text-slate">
            <div>
              <ImageSquare size={40} className="mx-auto" />
              <p className="mt-2 text-[15px]">Square photos work best. Drop one here or choose a file.</p>
            </div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/75 backdrop-blur-sm">
            <div className="w-2/3">
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${progress}%` }} />
              </div>
              <p className="tabular mt-2 text-center text-sm font-semibold text-ink">Uploading… {progress}%</p>
            </div>
          </div>
        )}
      </div>

      <label
        htmlFor={`${name}-file`}
        className={`press inline-flex h-12 w-fit cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-5 font-semibold text-ink hover:border-slate/50 ${
          uploading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <UploadSimple size={18} /> {url ? "Replace photo" : "Upload photo"}
      </label>

      {shownError && (
        <p role="alert" className="text-[15px] text-danger sm:text-sm">
          {shownError}
        </p>
      )}
    </div>
  );
}
