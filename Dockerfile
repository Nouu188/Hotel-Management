# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .

# BẮT BUỘC: Railway chỉ forward đến PORT 3000
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
