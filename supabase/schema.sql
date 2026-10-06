-- Quest Week: tabella per la sincronizzazione tra dispositivi.
-- Da eseguire una volta in Supabase: SQL Editor → New query → incolla tutto → Run.
-- Si può rieseguire senza problemi.

-- Ogni riga è un "pezzo" di dati dell'utente (una categoria, un obiettivo, una spunta, un appunto…).
-- data = null significa che il pezzo è stato eliminato.
create table if not exists public.items (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  key        text        not null,
  data       jsonb,
  updated_at bigint      not null,               -- quando è stato modificato sul dispositivo (ms)
  server_at  timestamptz not null default now(), -- quando è arrivato al server (per scaricare solo le novità)
  primary key (user_id, key)
);
create index if not exists items_user_server_at on public.items (user_id, server_at);

-- Sicurezza: ognuno vede e modifica solo i propri dati
alter table public.items enable row level security;

drop policy if exists "items_select_own" on public.items;
drop policy if exists "items_insert_own" on public.items;
drop policy if exists "items_update_own" on public.items;
create policy "items_select_own" on public.items for select to authenticated using (auth.uid() = user_id);
create policy "items_insert_own" on public.items for insert to authenticated with check (auth.uid() = user_id);
create policy "items_update_own" on public.items for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Invio delle modifiche: un pezzo viene sovrascritto solo se la versione in arrivo è più recente
-- ("l'ultima modifica vince").
create or replace function public.push_items(items jsonb)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.items (user_id, key, data, updated_at, server_at)
  select auth.uid(), t.i->>'key', nullif(t.i->'data', 'null'::jsonb), (t.i->>'updated_at')::bigint, clock_timestamp()
  from jsonb_array_elements(items) as t(i)
  on conflict (user_id, key) do update
    set data = excluded.data, updated_at = excluded.updated_at, server_at = clock_timestamp()
    where public.items.updated_at <= excluded.updated_at;
$$;

revoke execute on function public.push_items(jsonb) from public, anon;
grant execute on function public.push_items(jsonb) to authenticated;
