import { OpenAPIHono } from "@hono/zod-openapi";
import award from "@routes/award";
import dailyData from "@routes/dailyData";
import historicalStat from "@routes/historicalStat";
import hourlyData from "@routes/hourlyData";
import leaderboard from "@routes/leaderboard";
import stat from "@routes/stat";
import station from "@routes/station";
import { Scalar } from "@scalar/hono-api-reference";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";

const app = new OpenAPIHono().basePath("/api");

// Cors, only allowing origin to all since this is all Get APIs
app.use(
  "*",
  cors({
    origin: "*",
  }),
);

// Documentation
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "GoldstarBoard API",
    version: "1.0.0",
  },
});

// eslint-disable-next-line new-cap
app.get(
  "/",
  Scalar({
    url: "/api/doc",
    theme: "laserwave",
    layout: "modern",
    pageTitle: "GoldstarBoard API",
    title: "GoldstarBoard API",
    slug: "gsb-api",
    telemetry: false,
  }),
);

const routes = [
  stat,
  station,
  hourlyData,
  historicalStat,
  dailyData,
  award,
  leaderboard,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

// Health check
app.get("/healthz", (c) => c.text(":)", 200));

// Rate limiting
app.use(
  rateLimiter({
    windowMs: 30 * 60 * 1000, // 30 mins
    limit: 50,
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "",
    message: { error: "Too many requests", retryAfter: "30 minutes" },
    statusCode: 429,
    skipFailedRequests: true,
  }),
);

export type AppType = (typeof routes)[number];

export default {
  port: Bun.env["PORT"]! || 3000,
  host: Bun.env["HOST"]! || "0.0.0.0",
  fetch: app.fetch,
};
