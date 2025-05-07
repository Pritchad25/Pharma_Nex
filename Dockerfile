# ---------- Base stage: shared by dev & prod ----------
FROM node:18-bullseye-slim AS base
WORKDIR /workspace
COPY package*.json ./

# ---------- Development stage ----------
FROM base AS development
ENV NODE_ENV=development
# Full install — includes nodemon, jest (devDependencies)
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---------- Production stage ----------
FROM base AS production
ENV NODE_ENV=production
# Only production deps — smaller, more secure image
RUN npm ci --omit=dev
COPY . .
RUN useradd --user-group --create-home --shell /bin/bash appuser \
 && chown -R appuser:appuser /workspace
USER appuser
EXPOSE 3000
CMD ["node", "backend/server.js"]
