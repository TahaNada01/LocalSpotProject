# Build step
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

# Serve step
FROM nginx:alpine
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
