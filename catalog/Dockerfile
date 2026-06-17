# Base Image:
# -----------
# Install source, tests, and node dependencies
FROM public.ecr.aws/lambda/nodejs:24 AS base
WORKDIR /usr/app

COPY package.json eslint.config.mjs tsconfig.json package-lock.json ./
RUN npm i
COPY src ./src
# COPY test ./test/


# Builder image:
# --------------
# Compile TypeScript Lambda code to JS
FROM base AS builder
RUN npm run build

# Lambda Execution Image:
# -----------------------
# Start with a fresh Lambda runtime image and copy
# the built executable. Burn in the commit hash for
# version auditing.
FROM public.ecr.aws/lambda/nodejs:24 AS dist
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
ARG GITHUB_COMMIT_HASH
ARG VERSION_NUMBER
ENV BUILD_ID=$GITHUB_COMMIT_HASH
ENV BUILD_VERSION=$VERSION_NUMBER
# The default value is overriden in the Lambda image configuration
CMD [ "index.handler" ]

# Test Runner Image
# -----------------
FROM base AS test
ENV NODE_ENV=test
ENTRYPOINT [ "npm" ]
# Run unit tests by default
CMD [ "run", "test", "unit" ]
