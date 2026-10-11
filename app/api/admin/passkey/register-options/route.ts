import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { isAdmin } from "@/lib/admin-auth";
import { listPasskeys, relyingParty, RP_NAME, saveChallenge } from "@/lib/passkeys";

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rpID } = relyingParty(request);
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userName: "owner",
    userDisplayName: "Tilly's Gallery owner",
    userID: new TextEncoder().encode("tilly-owner"),
    attestationType: "none",
    excludeCredentials: (await listPasskeys()).map((p) => ({ id: p.id })),
    authenticatorSelection: { residentKey: "required", userVerification: "required" },
  });
  await saveChallenge(options.challenge);
  return NextResponse.json(options);
}
