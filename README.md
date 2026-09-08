# Apex Veterinario — Plataforma Multi-Tenant

Plataforma integral de salud y bienestar animal. Soporta multiples clinicas
(tenants) con branding propio, base de datos aislada y autenticacion independiente.

## Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + Zustand |
| Backend  | NestJS + Prisma ORM |
| BD       | PostgreSQL con Row-Level Security |
| CI/CD    | GitHub Actions → Netlify |

## Estructura multi-tenant

```
clinica1.apexvet.com/services   → tenant = clinica1
apexvet.com/clinica2/services   → tenant = clinica2
```

## Inicio rapido

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Iniciar frontend (puerto 3000)
npm run dev --workspace=apps/web

# Iniciar backend (puerto 4000)
npm run start:dev --workspace=apps/api

# Correr tests
npm test --workspace=apps/web
```

## Acceso por tenant (desarrollo)

Agrega estas lineas a tu archivo hosts (`C:\Windows\System32\drivers\etc\hosts`):

```
127.0.0.1  clinica1.localhost
127.0.0.1  clinica2.localhost
```

Luego accede a:
- http://clinica1.localhost:3000/services
- http://clinica2.localhost:3000/services
- http://localhost:3000/clinica3/services  (prefijo de ruta, sin hosts)

## Rutas disponibles

| Ruta | Acceso | Descripcion |
|------|--------|-------------|
| `/[tenant]` | Publico | Home de la clinica |
| `/[tenant]/services` | Publico | Servicios veterinarios |
| `/[tenant]/catalog` | Publico | Tienda de productos |
| `/[tenant]/login` | Publico | Inicio de sesion |
| `/[tenant]/register` | Publico | Registro de cuenta |
| `/[tenant]/pets` | Autenticado | Mis mascotas |
| `/[tenant]/appointments` | Autenticado | Mis citas |
| `/[tenant]/checkout` | Autenticado | Proceso de pago |
| `/[tenant]/orders` | Autenticado | Historial de ordenes |

## Variables de entorno requeridas (produccion)

Ver `.env.example` para la lista completa.

## Migracion de base de datos

```bash
cd apps/api
# Agregar tenant_id a todas las tablas
psql $DATABASE_URL < ../../docs/tenant_migration.sql
```
