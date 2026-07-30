revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_active_family_member(uuid) from public, anon;
revoke execute on function public.is_family_owner(uuid) from public, anon;
revoke execute on function public.can_access_baby(uuid) from public, anon;
revoke execute on function public.owns_ai_conversation(uuid) from public, anon;
revoke execute on function public.create_family(text) from public, anon;
grant execute on function public.is_active_family_member(uuid), public.is_family_owner(uuid), public.can_access_baby(uuid), public.owns_ai_conversation(uuid), public.create_family(text) to authenticated;
