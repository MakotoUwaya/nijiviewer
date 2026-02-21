-- Allow users to update their own favorites (needed for sort_order updates)
create policy "Users can update their own favorites"
  on public.user_favorite_organizations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
