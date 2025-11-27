# Dockerfile para el frontend (Vite + React)
FROM node:current-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile || npm install
COPY . .
RUN npm run build

# Servir estáticos con nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
