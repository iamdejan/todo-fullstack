FROM node:22

WORKDIR /app

COPY ./ /app/

RUN npm install -g pnpm@9.10.0 && pnpm install

CMD [ "pnpm", "run", "preview" ]
