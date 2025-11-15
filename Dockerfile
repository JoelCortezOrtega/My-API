FROM node:20-alpine
WORKDIR /app

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl

# Copiar archivos de dependencias del backend
COPY backend/package*.json ./

# Instalar dependencias del backend
RUN npm install

# Copiar prisma schema y migraciones
COPY prisma ./prisma

# Generar cliente Prisma
RUN npx prisma generate

# Copiar código fuente del backend
COPY backend/src ./src

# Crear script de inicio con manejo de migraciones
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "🔧 Verificando conexión a base de datos..."' >> /app/start.sh && \
    echo 'echo "DATABASE_URL configurada: $(echo $DATABASE_URL | cut -c1-20)..."' >> /app/start.sh && \
    echo 'echo "🗄️ Ejecutando push de schema de Prisma..."' >> /app/start.sh && \
    echo 'npx prisma db push --accept-data-loss || echo "❌ Error en db push, continuando..."' >> /app/start.sh && \
    echo 'echo "✅ Iniciando servidor..."' >> /app/start.sh && \
    echo 'node src/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Exponer puerto
EXPOSE 3000

# Ejecutar script de inicio
CMD ["/app/start.sh"]