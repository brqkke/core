FROM node:16.17.1-alpine3.16  As build

# Create app directory
WORKDIR /app
COPY package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY . .

# Run the build command which creates the production bundle
RUN npm run build

FROM node:16.17.1-alpine3.16 as prod-dependencies
WORKDIR /app
# Set NODE_ENV environment variable
ENV NODE_ENV production
COPY  --from=build /app/package*.json ./
# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit dev --omit peer --omit optional && npm cache clean --force

FROM node:16.17.1-alpine3.16 As production

WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY  --from=prod-dependencies /app/node_modules ./node_modules
COPY  --from=build /app/dist ./dist
COPY  --from=prod-dependencies /app/*.json ./

ARG appVersion
ENV APP_VERSION=$appVersion
ENV NODE_ENV production

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
