FROM node:22-alpine

WORKDIR /app

# Dépendances d'abord, pour garder le cache Docker tant que package.json ne change pas.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
