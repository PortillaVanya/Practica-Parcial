# =============================================================================
# Dockerfile.TODO — Plantilla con errores intencionales para la práctica
# =============================================================================
# INSTRUCCIONES:
# 1. Copia este archivo como "Dockerfile" en la raíz del proyecto (sin .TODO)
# 2. Revisa y corrige cada bloque marcado con TODO
# 3. Verifica el build: docker build -t practica-backend .
# 4. Prueba local: docker run --env-file .env -p 3000:3000 practica-backend
# =============================================================================

# --- Etapa 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalación reproducible
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Etapa 2: Runner (producción) ---
FROM node:20-alpine AS runner

WORKDIR /app

# Configura el entorno de ejecución para producción.
ENV NODE_ENV=production

# Instala solo las dependencias necesarias para ejecutar la app (sin devDependencies).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copia los archivos compilados desde la etapa de build a esta imagen.
COPY --from=builder /app/dist ./dist

# Comando de arranque para ejecutar el punto de entrada compilado de NestJS.
CMD ["node", "dist/main.js"]

# Puerto por defecto
EXPOSE 8080
