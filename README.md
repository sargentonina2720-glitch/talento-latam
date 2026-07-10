# TalentoLATAM — MVP

Marketplace de freelancers verificados para Latinoamérica. Next.js 14 (App Router) + Supabase + Tailwind CSS.

## 1. Instalar dependencias

```bash
npm install
```

## 2. Conectar con tu base de datos de Supabase

Ya tienes el esquema SQL creado (tablas `perfiles`, `freelancers`, `empresas`, `proyectos`). Solo falta conectar las credenciales:

1. Copia `.env.local.example` a `.env.local`
2. Ve a tu proyecto en supabase.com → Project Settings → API
3. Copia la "Project URL" y la "anon public key" a `.env.local`

```bash
cp .env.local.example .env.local
```

## 3. Habilitar inserciones (importante)

El SQL que ya ejecutaste solo tiene políticas de **lectura pública** (`SELECT`). Para que el registro funcione, necesitas agregar políticas de **inserción**. Ejecuta esto también en el SQL Editor de Supabase:

```sql
CREATE POLICY "Usuarios pueden crear su propio perfil"
  ON perfiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Freelancers pueden crear su propio registro"
  ON freelancers FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Empresas pueden crear su propio registro"
  ON empresas FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Empresas pueden crear proyectos propios"
  ON proyectos FOR INSERT
  WITH CHECK (auth.uid() = empresa_id);
```

Sin estas políticas, Supabase bloqueará todos los formularios de registro por seguridad (RLS).

## 4. Correr en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## 5. Estructura del proyecto

```
app/
  page.tsx                    -> Landing page
  login/page.tsx               -> Inicio de sesión
  registro/freelancer/page.tsx -> Registro de freelancer
  registro/empresa/page.tsx    -> Registro de empresa
  dashboard/freelancer/page.tsx -> Panel del freelancer
  dashboard/empresa/page.tsx    -> Panel de empresa + publicar proyecto
  proyectos/page.tsx            -> Listado público de proyectos
lib/
  supabase/client.ts   -> Cliente de Supabase para el navegador
  supabase/server.ts   -> Cliente de Supabase para el servidor
  actions/             -> Server Actions (backend): registro, login, publicar proyecto
types/database.ts      -> Tipos que reflejan el esquema SQL
```

## 6. Qué falta para producción (fuera del alcance del MVP de 30 días)

- Validación real por IA de habilidades (hoy es manual/pendiente)
- Pagos automatizados (hoy se maneja fuera de la app)
- Sistema de disputas con panel de arbitraje (hoy llega por contacto directo)
- Deploy: conecta este repo a Vercel y agrega las mismas variables de entorno ahí

## 7. Deploy a Vercel

```bash
npm i -g vercel
vercel
```

Agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el dashboard de Vercel (Settings → Environment Variables).
