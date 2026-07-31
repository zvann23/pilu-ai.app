import { getSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  // Deleting auth.users requires the Admin API (service role key) — check
  // it's configured before touching any data, so a family the caller owns
  // never gets wiped out from under an incomplete deletion.
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: "Account deletion isn't available right now. Please try again later or contact support." }, { status: 503 });
  }

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // Runs as the caller (their own session, not the admin client) so
  // auth.uid() inside the function resolves correctly. Removes any family
  // they solely own and cleans up the few FKs that don't cascade — see
  // the migration for the full explanation.
  const { error: cleanupError } = await supabase.rpc("delete_own_account");
  if (cleanupError) {
    return NextResponse.json({ error: cleanupError.message }, { status: 409 });
  }

  const { error: deleteUserError } = await adminClient.auth.admin.deleteUser(user.id);
  if (deleteUserError) {
    return NextResponse.json({ error: "Your data was removed, but we couldn't fully close your account. Please contact support." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
