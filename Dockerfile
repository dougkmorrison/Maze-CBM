FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm --filter @workspace/maze-cbm run build
RUN pnpm --filter @workspace/api-server run build

FROM node:22-slim AS runner
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-workspace.yaml ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/artifacts/api-server/package.json ./artifacts/api-server/
COPY --from=build /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=build /app/artifacts/maze-cbm/dist ./artifacts/maze-cbm/dist
COPY --from=build /app/lib ./lib

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "artifacts/api-server/dist/index.cjs"]
