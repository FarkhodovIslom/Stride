#!/bin/sh

# Generate Prisma client
npx prisma generate

# Push schema to database (create tables if they don't exist)
npx prisma db push

# Start the application
exec "$@"

