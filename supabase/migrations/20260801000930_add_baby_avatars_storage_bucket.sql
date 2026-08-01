-- Public bucket for baby profile photos, matching babies.avatar_url's existing
-- "plain public URL" shape. Objects live at {family_id}/{baby_id}.{ext}; write
-- access is scoped to active members of that family via is_active_family_member,
-- the same helper the babies table's own RLS policies already use.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('baby-avatars', 'baby-avatars', true, 4194304, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

create policy "baby_avatars_read_public" on storage.objects
  for select to public
  using (bucket_id = 'baby-avatars');

create policy "baby_avatars_insert_members" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'baby-avatars' and public.is_active_family_member((storage.foldername(name))[1]::uuid));

create policy "baby_avatars_update_members" on storage.objects
  for update to authenticated
  using (bucket_id = 'baby-avatars' and public.is_active_family_member((storage.foldername(name))[1]::uuid))
  with check (bucket_id = 'baby-avatars' and public.is_active_family_member((storage.foldername(name))[1]::uuid));

create policy "baby_avatars_delete_members" on storage.objects
  for delete to authenticated
  using (bucket_id = 'baby-avatars' and public.is_active_family_member((storage.foldername(name))[1]::uuid));
