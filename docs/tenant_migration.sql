-- =====================================================
-- MIGRACION: Agregar tenant_id a todas las tablas
-- Ejecutar en PostgreSQL con permisos de superusuario
-- =====================================================

-- 1. Tabla de tenants (si no existe)
CREATE TABLE IF NOT EXISTS tenants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT UNIQUE NOT NULL,       -- identificador URL (ej: clinica1)
  name       TEXT NOT NULL,
  domain     TEXT UNIQUE,                -- sub-dominio personalizado
  theme      JSONB DEFAULT '{}',         -- { primaryColor, accentColor, logoUrl }
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agregar tenant_id a tablas existentes
ALTER TABLE users       ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE pets        ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE services    ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE orders      ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE veterinarians ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- 3. Indices de rendimiento
CREATE INDEX IF NOT EXISTS idx_users_tenant        ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pets_tenant         ON pets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_tenant     ON services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant       ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON appointments(tenant_id);

-- 4. Row-Level Security (RLS)
ALTER TABLE pets         ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Politica: solo ver registros del mismo tenant (usando variable de sesion)
CREATE POLICY tenant_isolation_pets ON pets
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_orders ON orders
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_appointments ON appointments
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- 5. Tenants de ejemplo
INSERT INTO tenants (slug, name, theme) VALUES
  ('clinica1', 'Clinica Veterinaria San Lucas',
   '{"primaryColor":"#7c3aed","accentColor":"#a78bfa","logoUrl":"/tenants/clinica1/logo.svg"}'),
  ('clinica2', 'Veterinaria del Valle',
   '{"primaryColor":"#0f766e","accentColor":"#5eead4","logoUrl":"/tenants/clinica2/logo.svg"}'),
  ('clinica3', 'Paws and Care',
   '{"primaryColor":"#b45309","accentColor":"#fbbf24","logoUrl":"/tenants/clinica3/logo.svg"}')
ON CONFLICT (slug) DO NOTHING;
