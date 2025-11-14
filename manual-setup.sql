-- Comando para crear manualmente las tablas si las migraciones no funcionan
-- Ejecuta este SQL directamente en Railway PostgreSQL si es necesario

CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Crear índices únicos
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_rfc_key" ON "User"("rfc");

-- Verificar que las tablas se crearon
SELECT table_name FROM information_schema.tables WHERE table_schema='public';