FROM node:20

WORKDIR /app

COPY ./ /app/

RUN npm install -g pnpm@9.10.0 && pnpm install

ENTRYPOINT [ "pnpm", "run", "dev" ]
