FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_CENTER_LAT
ARG VITE_CENTER_LON
ARG VITE_MAPTILER_KEY
ARG VITE_DARK_MAP_ID
ARG VITE_LIGHT_MAP_ID

ENV VITE_CENTER_LAT=$VITE_CENTER_LAT
ENV VITE_CENTER_LON=$VITE_CENTER_LON
ENV VITE_MAPTILER_KEY=$VITE_MAPTILER_KEY
ENV VITE_DARK_MAP_ID=$VITE_DARK_MAP_ID
ENV VITE_LIGHT_MAP_ID=$VITE_LIGHT_MAP_ID

COPY package.json package-lock.json ./

RUN npm ci
COPY . .

RUN npm run build

FROM nginx:stable-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html

RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
