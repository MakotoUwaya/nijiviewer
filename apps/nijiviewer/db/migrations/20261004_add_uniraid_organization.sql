-- Insert Uniraid organization
insert into public.organizations (id, name, channel_id) values
  ('Uniraid!', 'ゆにれいど', 'UCKofJjNEmQ3LwERp3pRVxtw')
on conflict (id) do update set
  name = excluded.name,
  channel_id = excluded.channel_id;
