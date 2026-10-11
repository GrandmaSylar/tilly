import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { listPasskeys, relyingParty, saveChallenge } from "@/lib/passkeys";

export async function POST(request: Request) {
  if ((await listPasskeys()).length === 0) {
    return NextResponse.json({ error: "No passkey is set up yet. Sign in with your password first." }, { status: 404 });
  }
  const { rpID } = relyingParty(request);
  // Discoverable credentials: the device offers the passkey itself, so nothing is revealed here.
  const options = await generateAuthenticationOptions({ rpID, userVerification: "required" });
  await saveChallenge(options.challenge);
  return NextResponse.json(options);
}
