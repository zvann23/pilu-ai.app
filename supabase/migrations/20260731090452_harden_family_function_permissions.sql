-- Match the existing convention (see harden_function_permissions migration):
-- these RPCs should only be callable by an authenticated session (anonymous
-- sign-in included), never by a fully anonymous `anon`-role request.
revoke execute on function public.redeem_family_invite(text) from anon;
revoke execute on function public.remove_family_member(uuid, uuid) from anon;
revoke execute on function public.leave_family(uuid) from anon;
revoke execute on function public.transfer_family_ownership(uuid, uuid) from anon;
revoke execute on function public.touch_family_presence(uuid) from anon;
