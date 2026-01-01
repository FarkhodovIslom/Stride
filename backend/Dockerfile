FROM node:20-alpine

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl openssl-dev

COPY package.json package-lock.json* ./

RUN npm ci

# Generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

ENV NODE_ENV=development
ENV PORT=4000

EXPOSE 4000

CMD ["npm", "run", "dev"]

