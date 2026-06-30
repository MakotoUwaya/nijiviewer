-- Remove legacy automatic grants before exposing only the operations used
-- through supabase-js. RLS policies continue to determine which rows each
-- user can access.
revoke all privileges
  on table public.organizations,
           public.favorite_livers,
           public.user_favorite_organizations,
           public.liver_search_history
  from anon, authenticated;

grant select
  on table public.organizations
  to anon, authenticated;

grant select, insert, delete
  on table public.favorite_livers
  to authenticated;

grant select, insert, update, delete
  on table public.user_favorite_organizations
  to authenticated;

grant select, insert, delete
  on table public.liver_search_history
  to authenticated;

-- Inserts into tables with generated numeric IDs require their sequences.
revoke all privileges
  on sequence public.favorite_livers_id_seq,
              public.liver_search_history_id_seq
  from anon, authenticated;

grant usage, select
  on sequence public.favorite_livers_id_seq,
              public.liver_search_history_id_seq
  to authenticated;

-- The application supports deleting a user's own search history. The original
-- table migration did not include the corresponding RLS policy.
create policy "Users can delete own search history"
  on public.liver_search_history
  for delete
  to authenticated
  using (auth.uid() = creator_id);
