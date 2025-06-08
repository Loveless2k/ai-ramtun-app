# 🔐 Configuración de Supabase para Ramtun

Esta guía te ayudará a configurar Supabase para habilitar la autenticación real en Ramtun.

## 📋 Prerrequisitos

- Cuenta en [Supabase](https://supabase.com)
- Proyecto Ramtun clonado localmente

## 🚀 Paso 1: Crear Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Haz clic en "New Project"
3. Completa los datos:
   - **Name**: `ramtun-app`
   - **Database Password**: Genera una contraseña segura
   - **Region**: Selecciona la más cercana a Chile
4. Haz clic en "Create new project"

## 🔧 Paso 2: Configurar Variables de Entorno

1. En tu proyecto Supabase, ve a **Settings > API**
2. Copia las siguientes credenciales:
   - **Project URL**
   - **anon public key**
   - **service_role key** (¡Mantén esto secreto!)

3. En tu proyecto local, crea el archivo `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_project_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# OpenAI Configuration (opcional)
OPENAI_API_KEY=tu_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄️ Paso 3: Crear Tablas de Base de Datos

En el **SQL Editor** de Supabase, ejecuta el siguiente script:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('teacher', 'student', 'admin')) NOT NULL DEFAULT 'student',
  school_id UUID REFERENCES public.schools(id),
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schools table
CREATE TABLE public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('public', 'private')) NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crosswords table
CREATE TABLE public.crosswords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  level TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  questions JSONB NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
  school_id UUID REFERENCES public.schools(id) NOT NULL,
  embedding VECTOR(1536), -- Para búsqueda semántica
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crosswords ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for crosswords
CREATE POLICY "Teachers can view own crosswords" ON public.crosswords
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can create crosswords" ON public.crosswords
  FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own crosswords" ON public.crosswords
  FOR UPDATE USING (teacher_id = auth.uid());

-- Create RLS policies for schools
CREATE POLICY "Users can view schools" ON public.schools
  FOR SELECT TO authenticated USING (true);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔐 Paso 4: Configurar Autenticación

1. Ve a **Authentication > Settings**
2. Configura las siguientes opciones:

### Email Settings:
- **Enable email confirmations**: ✅ Activado
- **Enable email change confirmations**: ✅ Activado

### OAuth Providers (Opcional):
Para habilitar Google OAuth:
1. Ve a **Authentication > Providers**
2. Habilita **Google**
3. Configura con tus credenciales de Google Cloud Console

### URL Configuration:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: 
  - `http://localhost:3000/auth/callback`
  - `https://tu-dominio.com/auth/callback` (para producción)

## 🧪 Paso 5: Probar la Configuración

1. Reinicia tu servidor de desarrollo:
```bash
npm run dev
```

2. Ve a `http://localhost:3000/auth/login`
3. Intenta registrar un nuevo usuario
4. Verifica que el usuario aparece en **Authentication > Users**
5. Verifica que se crea el perfil en la tabla `profiles`

## 🚨 Solución de Problemas

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que no hay espacios extra en las claves

### Error: "Row Level Security"
- Verifica que las políticas RLS estén configuradas correctamente
- Revisa que el usuario tenga los permisos necesarios

### Error: "Email not confirmed"
- Revisa la configuración de confirmación por email
- Verifica que el usuario haya confirmado su email

## 📚 Recursos Adicionales

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🎯 Próximos Pasos

Una vez configurado Supabase:
1. La autenticación real estará habilitada
2. Los usuarios podrán registrarse y hacer login
3. Los datos se persistirán en la base de datos
4. Las rutas estarán protegidas por roles

¡Tu aplicación Ramtun estará lista para producción! 🚀
