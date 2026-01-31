FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
# (to Bosta supervisor) 
# note that we dont run migrations here, because they can cause race conditions 
# in a multi-container environment. in that case, migrations should 
# be run via an "Orchestrator" like kubernetes, to make sure only 1 container runs the migrations
CMD ["npm", "run", "dev"]