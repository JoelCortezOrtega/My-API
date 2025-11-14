FROM node:20-alpine
WORKDIR /app

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl

# Copiar archivos de dependencias
COPY backend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar prisma antes de generar cliente
COPY prisma ./prisma

# Generar cliente de Prisma
RUN npx prisma generate

# Copiar el código fuente
COPY backend/src ./src

# Exponer puerto
EXPOSE 3000

# Iniciar servidor
CMD ["node", "src/index.js"]


