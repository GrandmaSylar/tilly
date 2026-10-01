import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { cloudinaryConfig, signUpload, UPLOAD_FOLDER } from "@/lib/cloudinary-server";

/** Returns a short-lived signature so the browser can upload straight to Cloudinary without seeing the API secret. */
export async function POST() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cloudName, apiKey } = cloudinaryConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder: UPLOAD_FOLDER, timestamp };

  return NextResponse.json({ ...params, signature: signUpload(params), apiKey, cloudName });
}
