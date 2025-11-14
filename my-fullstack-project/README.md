# Mi Full Stack Project

Sistema de cumplimiento fiscal con autenticación basada en JWT y base de datos PostgreSQL.

## 📋 Requisitos previos

- Docker y Docker Compose
- Node.js 20+ (si ejecutas sin Docker)
- npm o yarn

## 🚀 Instalación y Ejecución

### Con Docker (Recomendado)

1. **Clona el repositorio**

   ```bash
   git clone <repository-url>
   cd my-fullstack-project
   ```

2. **Configura las variables de entorno**

   ```bash
   # Ya están preconfiguradas en .env
   # Para producción, actualiza los valores en .env
   ```

3. **Inicia los servicios**

   ```bash
   docker-compose up --build
   ```

   Esto iniciará:

   - PostgreSQL en puerto 5432
   - Backend en puerto 3000
   - Frontend en puerto 5173

4. **Accede a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432

### Sin Docker

1. **Backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Base de datos**
   - Crea una instancia de PostgreSQL localmente
   - Actualiza `DATABASE_URL` en `.env`
   - Ejecuta migraciones: `npx prisma migrate dev --name init`

## 📁 Estructura del Proyecto

```
.
├── backend/
│   ├── src/
│   │   └── index.js          # Servidor Express con rutas
│   ├── prisma/               # Esquema de base de datos
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── css/              # Estilos
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── prisma/
│   └── schema.prisma         # Definición de base de datos
├── docker-compose.yml
└── .env
```

## 🔐 Autenticación

El sistema implementa autenticación JWT:

### Endpoints

- **POST /auth/register** - Registrar nuevo usuario

  ```json
  {
    "email": "usuario@example.com",
    "rfc": "RFC1234567890",
    "nombre": "John Doe",
    "password": "password123",
    "passwordConfirm": "password123"
  }
  ```

- **POST /auth/login** - Iniciar sesión

  ```json
  {
    "email": "usuario@example.com",
    "password": "password123"
  }
  ```

- **GET /auth/me** - Obtener datos del usuario (requiere token)

  ```
  Headers: Authorization: Bearer <token>
  ```

- **POST /auth/logout** - Cerrar sesión (requiere token)

## 🛠️ Desarrollo

### Variables de entorno

Ver `.env.example` para la lista completa de variables.

### Migraciones de Prisma

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Ver estado de migraciones
npx prisma migrate status

# Resetear base de datos (CUIDADO - borra todos los datos)
npx prisma migrate reset
```

### CLI de Prisma

```bash
# Abrir Prisma Studio (interfaz gráfica)
npx prisma studio
```

## 📚 Tecnologías

**Frontend:**

- React + Vite
- React Router DOM
- Bootstrap 5
- Bootstrap Icons
- CSS personalizado

**Backend:**

- Express.js
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt

**Otros:**

- Docker & Docker Compose

## 🔒 Seguridad en Producción

Antes de desplegar:

1. Cambia `JWT_SECRET` en `.env`
2. Cambia credenciales de PostgreSQL
3. Actualiza `CORS_ORIGIN` a tu dominio
4. Habilita HTTPS
5. Implementa rate limiting
6. Agrega validación adicional de entrada

## 📝 Licencia

MIT

## 👤 Autor

Javier Nieto
