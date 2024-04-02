FROM node:19
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000 \
    POSTGRES_USER=postgresadmin \
    POSTGRES_PASSWORD=admin123
EXPOSE 3000
RUN npx prisma generate
CMD [ "npm", "run", "start" ]