-- ============================================
-- Tienda App - Database Schema for Supabase
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- Profiles (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Categories
-- ============================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  image text,
  description text,
  parent_id uuid references public.categories(id),
  "order" integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Anyone can view active categories"
  on public.categories for select
  using (active = true);

create policy "Admins can manage categories"
  on public.categories for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- Products
-- ============================================
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  price numeric not null check (price >= 0),
  compare_at_price numeric check (compare_at_price >= 0),
  images text[] not null default '{}',
  category_id uuid references public.categories(id),
  category_name text,
  stock integer not null default 0 check (stock >= 0),
  sku text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  active boolean not null default true,
  variants jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products for select
  using (active = true);

create policy "Admins can manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- Addresses
-- ============================================
create table public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  street text not null,
  number text not null,
  floor text,
  apartment text,
  city text not null,
  state text not null,
  zip_code text not null,
  country text not null default 'Argentina',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- ============================================
-- Orders
-- ============================================
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  items jsonb not null,
  subtotal numeric not null,
  shipping_cost numeric not null default 0,
  total numeric not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb not null,
  payment_method text not null,
  payment_id text,
  tracking_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================
-- Push notification tokens
-- ============================================
create table public.push_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  token text not null,
  platform text not null,
  created_at timestamptz not null default now(),
  unique(user_id, token)
);

alter table public.push_tokens enable row level security;

create policy "Users can manage own tokens"
  on public.push_tokens for all
  using (auth.uid() = user_id);

-- ============================================
-- Sample data (optional)
-- ============================================
insert into public.categories (name, slug, "order") values
  ('Ropa', 'ropa', 1),
  ('Accesorios', 'accesorios', 2),
  ('Calzado', 'calzado', 3),
  ('Tecnología', 'tecnologia', 4),
  ('Hogar', 'hogar', 5);
