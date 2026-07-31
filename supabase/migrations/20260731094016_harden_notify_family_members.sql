-- Supabase auto-grants EXECUTE to anon at function creation time, separate
-- from the PUBLIC grant already revoked — revoke it explicitly too.
revoke execute on function public.notify_family_members(uuid, uuid, text, text, text, text) from anon;
