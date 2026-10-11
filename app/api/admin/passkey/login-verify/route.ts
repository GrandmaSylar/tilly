import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { startSession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { findPasskey, relyingParty, takeChallenge } from "@/lib/passkeys";

export async function POST(request: Request) {
  const { response } = await request.json();
  const expectedChallenge = await takeChallenge();
  const passkey = typeof response?.id === "string" ? await findPasskey(response.id) : null;
  if (!expectedChallenge || !passkey) return NextResponse.json({ error: "That passkey isn't recognised." }, { status: 400 });

  const { rpID, origin } = relyingParty(request);
  try {
    const result = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
      credential: {
        id: passkey.id,
        publicKey: new Uint8Array(Buffer.from(passkey.publicKey, "base64url")),
        counter: passkey.counter,
        transports: (passkey.transports ?? undefined) as never,
      },
    });
    if (!result.verified) return NextResponse.json({ error: "Couldn't verify the passkey." }, { status: 400 });

    await db()`update admin_passkeys set counter = ${result.authenticationInfo.newCounter}, last_used_at = now() where id = ${passkey.id}`;
    await startSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Couldn't verify the passkey." }, { status: 400 });
  }
}
