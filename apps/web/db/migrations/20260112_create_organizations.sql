-- Create organizations table
create table public.organizations (
  id text primary key,
  name text not null,
  channel_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.organizations enable row level security;

-- Create policy to allow read access for everyone
create policy "Allow public read access"
  on public.organizations
  for select
  to public
  using (true);

-- Insert initial data
insert into public.organizations (id, name, channel_id) values
  ('Nijisanji', 'にじさんじ', 'UCX7YkU9nEeaoZbkVLVajcMg'),
  ('Hololive', 'ホロライブ', 'UCJFZiqLMntJufDCHc6bQixg'),
  ('VSpo', 'ぶいすぽ', 'UCuI5XaO-6VkOEhHao6ij7JA'),
  ('Neo-Porte', 'ネオポルテ', 'UCm5rjZAFQuRrnDCkxnwvWkg'),
  ('774inc', 'ななしいんく', 'UCJEpkwwDiTKS5lxwFttEbIQ'),
  ('Varium', 'ぶいありうむ', 'UCAytwphRHoPcvLr_qRvn3Zw');

-- Create user_favorite_organizations table
create table public.user_favorite_organizations (
  user_id uuid references auth.users not null,
  organization_id text references public.organizations(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, organization_id)
);

-- Enable RLS
alter table public.user_favorite_organizations enable row level security;

-- Create policies

-- Allow users to view their own favorites
create policy "Users can view their own favorites"
  on public.user_favorite_organizations
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Allow users to insert their own favorites
create policy "Users can insert their own favorites"
  on public.user_favorite_organizations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow users to delete their own favorites
create policy "Users can delete their own favorites"
  on public.user_favorite_organizations
  for delete
  to authenticated
  using (auth.uid() = user_id);
