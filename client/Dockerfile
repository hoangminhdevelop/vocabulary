FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies during build (for caching)
RUN npm install

COPY . .

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev", "--", "--host"]
