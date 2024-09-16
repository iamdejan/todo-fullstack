FROM node:22

WORKDIR /app

RUN npm install -g pnpm@9.10.0

COPY package.json /app/package.json

RUN pnpm install

COPY ./ /app/

CMD [ "pnpm", "run", "preview" ]
