FROM node:18-alpine

WORKDIR /app

# Copie les fichiers de configuration des dépendances
COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3000


CMD ["npm", "run", "dev"]
