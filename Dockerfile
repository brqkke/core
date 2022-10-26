FROM node:16.17.1-alpine3.16  As front-build

WORKDIR /app
COPY butanuki-front/package*.json ./
RUN npm ci
COPY butanuki-front/. .
RUN npm run build

FROM node:16.17.1-alpine3.16  As core-build

# Create app directory
WORKDIR /app
COPY butanuki-api/package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY butanuki-api/. .

# Run the build command which creates the production bundle
RUN npm run build

FROM node:16.17.1-alpine3.16 as core-prod-dependencies
WORKDIR /app
# Set NODE_ENV environment variable
ENV NODE_ENV production
COPY butanuki-api/package*.json ./
# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit dev --omit peer --omit optional && npm cache clean --force

FROM node:16.17.1-alpine3.16 As production

WORKDIR /app

# Copy the bundled code from the build stage to the production image
COPY  --from=core-prod-dependencies /app/node_modules ./node_modules
COPY  --from=core-build /app/dist ./dist
COPY butanuki-api/*.json ./
COPY  --from=front-build /app/build ./front-build

ARG appVersion
ENV APP_VERSION=$appVersion
ENV NODE_ENV production

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
