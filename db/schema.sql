-- Tilly catalogue + admin activity log (Neon Postgres).
-- Only the Next.js server talks to the database, via DATABASE_URL. Safe to re-run.

create table if not exists public.products (
  slug            text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name            text not null,
  category        text not null check (category in ('Perfumes', 'Bags', 'Clothing', 'Accessories', 'Beauty')),
  price           integer not null check (price > 0),
  original_price  integer check (original_price is null or original_price > 0),
  description     text not null default '',
  details         text not null default '',
  delivery        text not null default '',
  sizes           text[],
  is_featured     boolean not null default false,
  is_bestseller   boolean not null default false,
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  image_url       text not null default '',
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.activity_log (
  id            bigint generated always as identity primary key,
  action        text not null check (action in ('create', 'update', 'delete', 'stock', 'flag')),
  product_slug  text not null,
  summary       text not null,
  created_at    timestamptz not null default now()
);

create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();
