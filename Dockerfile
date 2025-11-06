# --- STAGE 1: Builder Stage (Combined Install and Build) ---
FROM node:23.9.0 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


# --- STAGE 2: Production Runner Stage ---
FROM node:23.9.0
WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public

EXPOSE 3000
CMD ["npm","run","windows_start"]
