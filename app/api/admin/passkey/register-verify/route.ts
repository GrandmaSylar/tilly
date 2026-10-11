import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { relyingParty, takeChallenge } from "@/lib/passkeys";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { response, label } = await request.json();
  const expectedChallenge = await takeChallenge();
  if (!expectedChallenge) return NextResponse.json({ error: "That request expired. Try again." }, { status: 400 });

  const { rpID, origin } = relyingParty(request);
  try {
    const result = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });
    if (!result.verified) return NextResponse.json({ error: "Couldn't verify the passkey." }, { status: 400 });

    const { credential } = result.registrationInfo;
    const publicKey = Buffer.from(credential.publicKey).toString("base64url");
    const name = String(label ?? "").trim().slice(0, 40) || "Passkey";
    await db()`
      insert into admin_passkeys (id, public_key, counter, transports, label)
      values (${credential.id}, ${publicKey}, ${credential.counter}, ${credential.transports ?? null}, ${name})
      on conflict (id) do nothing`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Couldn't verify the passkey." }, { status: 400 });
  }
}
