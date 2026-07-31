-- The prior migration revoked from `anon` directly, but functions are
-- granted EXECUTE to PUBLIC by default, and `anon` inherits through that —
-- revoking from `anon` alone doesn't remove it. Revoke from PUBLIC instead,
-- matching is_family_owner()'s actual ACL (authenticated + service_role only).
revoke execute on function public.redeem_family_invite(text) from public;
revoke execute on function public.remove_family_member(uuid, uuid) from public;
revoke execute on function public.leave_family(uuid) from public;
revoke execute on function public.transfer_family_ownership(uuid, uuid) from public;
revoke execute on function public.touch_family_presence(uuid) from public;

grant execute on function public.redeem_family_invite(text) to authenticated;
grant execute on function public.remove_family_member(uuid, uuid) to authenticated;
grant execute on function public.leave_family(uuid) to authenticated;
grant execute on function public.transfer_family_ownership(uuid, uuid) to authenticated;
grant execute on function public.touch_family_presence(uuid) to authenticated;
