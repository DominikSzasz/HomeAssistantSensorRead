# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build for production; adjust base-href if deploying under a subpath
RUN npm run build

# ---- runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /srv/app
# Install a tiny SPA-capable server
RUN npm i -g angular-http-server
# Copy Angular browser build output (Angular v15+ uses dist/<name>/browser)
COPY --from=build /app/dist/sensor-read/browser ./
EXPOSE 8001
# Serve with SPA fallback to index.html
CMD ["angular-http-server","--path",".","-p","8001"]
