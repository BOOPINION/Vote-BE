FROM node:20.11.1-alpine3.19 as base

# Set yarn version to 1.22.21
RUN npm install --forcc -g yarn@1.22.21


FROM base as deps

# Alpine Linux image is lightweighted distribution so it didn't has shared libc
# So we need to install gcompat for Node.js libraries
RUN apk add --no-cache gcompat

WORKDIR /app

# Copy files for build
COPY package.json ./
COPY yarn.lock ./
COPY src ./src
COPY nest-cli.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY package.prod.cjs ./

# Create package.json for production
RUN node package.prod.cjs
RUN mv -f package.prod.json package.json

# Install dependencies
RUN yarn install

RUN ls -a

# Build NestJS application
RUN yarn run build


FROM base as runner

WORKDIR /app

# Copy files for production that built in `deps` stage
COPY --from=deps /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./

CMD yarn run start:prod
