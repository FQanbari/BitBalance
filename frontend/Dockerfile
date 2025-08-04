# FROM node:20-alpine AS build
# WORKDIR /app

# COPY frontend/package*.json ./
# RUN npm install

# COPY frontend/ .
# RUN npm run build

# FROM node:20-alpine AS runtime
# WORKDIR /app
# COPY --from=build /app ./

# ENV NODE_ENV production
# EXPOSE 3000
# CMD ["npm", "start"]

FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build && npm run export

FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
