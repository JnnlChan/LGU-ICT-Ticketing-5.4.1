-- ==========================================
-- LGU ICT Help Desk - Supabase Schema
-- ==========================================

-- 1. Drop existing objects to allow clean re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

DROP TABLE IF EXISTS public.ticket_comments CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.assets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.departments CASCADE;

DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.user_status CASCADE;

-- 2. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Custom Types
CREATE TYPE public.user_role AS ENUM ('system_admin', 'ict_support', 'employee');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended');

-- 4. Tables
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role public.user_role DEFAULT 'employee'::public.user_role NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  status public.user_status DEFAULT 'active'::public.user_status NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  equipment_type TEXT NOT NULL,
  property_number TEXT,
  inventory_number TEXT,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  hostname TEXT,
  processor TEXT,
  memory TEXT,
  disk_storage TEXT,
  assigned_to TEXT,
  exact_location TEXT,
  operating_system TEXT,
  microsoft_office TEXT,
  condition TEXT DEFAULT 'Excellent',
  operational_status TEXT DEFAULT 'Operational',
  acquisition_cost DECIMAL(12,2),
  date_acquired DATE,
  date_audited DATE,
  audited_by TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Open' NOT NULL,
  priority TEXT DEFAULT 'Medium' NOT NULL,
  category TEXT NOT NULL,
  reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

-- Grants for authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 6. RLS Policies

-- Departments
CREATE POLICY "Departments are viewable by everyone" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins can insert departments" ON public.departments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'system_admin')
);
CREATE POLICY "Admins can update departments" ON public.departments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'system_admin')
);
CREATE POLICY "Admins can delete departments" ON public.departments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'system_admin')
);

-- Profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'system_admin')
);

-- Assets
CREATE POLICY "Assets viewable by everyone" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Assets insert" ON public.assets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('system_admin', 'ict_support'))
);
CREATE POLICY "Assets update" ON public.assets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('system_admin', 'ict_support'))
);

-- Tickets
CREATE POLICY "Tickets visibility" ON public.tickets FOR SELECT USING (
  auth.uid() = reported_by OR 
  auth.uid() = assigned_to OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('system_admin', 'ict_support'))
);
CREATE POLICY "Employees can create tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Ticket updates" ON public.tickets FOR UPDATE USING (
  auth.uid() = reported_by OR 
  auth.uid() = assigned_to OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('system_admin', 'ict_support'))
);

-- Comments
CREATE POLICY "Comments viewable" ON public.ticket_comments FOR SELECT USING (true);
CREATE POLICY "Comments insert" ON public.ticket_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 7. Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Auth Trigger for Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    new.id,
    COALESCE(new.email, ''),
    COALESCE(
      new.raw_user_meta_data->>'full_name', 
      split_part(new.email, '@', 1),
      'New User'
    ),
    CASE WHEN new.email = 'onealmahinay@gmail.com' THEN 'system_admin'::public.user_role ELSE 'employee'::public.user_role END,
    'active'::public.user_status
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Reload PostgREST schema cache to resolve 404 errors after dropping/recreating tables
NOTIFY pgrst, 'reload schema';
