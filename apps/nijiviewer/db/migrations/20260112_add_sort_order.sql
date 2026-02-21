-- Add sort_order column
alter table public.user_favorite_organizations
add column sort_order integer not null default 0;
