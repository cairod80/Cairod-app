-- ════════════════════════════════════════════════════════════════════════════
-- XAIROD · PHASE B · ROLLBACK  (only if you need to undo phase-b.sql)
-- Deletes NO photos and NO data.
-- WARNING: restoring the old policies re-opens the gap where any signed-in user
-- can upload to / delete from the listing-images bucket. Use only as a short-term undo.
-- ════════════════════════════════════════════════════════════════════════════

drop function if exists public.set_my_listing_media(text[], text);
drop function if exists public.ensure_listing_for_business(uuid);

drop policy if exists "Owner or admin uploads listing images" on storage.objects;
drop policy if exists "Owner or admin deletes listing images" on storage.objects;

create policy "Auth upload listing images" on storage.objects
  for insert to authenticated with check (bucket_id = 'listing-images');
create policy "Auth delete listing images" on storage.objects
  for delete to authenticated using (bucket_id = 'listing-images');
-- ("Public read listing images" is kept so photos keep showing.)

update storage.buckets set file_size_limit = null, allowed_mime_types = null where id = 'listing-images';

-- Left in place on purpose (harmless): columns logo_url, the one-listing-per-business
-- index and the foreign key.
