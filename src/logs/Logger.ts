import pino, { LoggerOptions } from "pino";

type TransportTarget = {
  target: string;
  level?: pino.LevelWithSilent;
  options?: Record<string, unknown>;
};

const baseConfig: LoggerOptions = {
  level: (process.env.LOG_LEVEL as pino.LevelWithSilent) || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: process.env.SERVICE_NAME,
    env: process.env.NODE_ENV || "development",
  },
};

const targets: TransportTarget[] = [
  {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: true,
    },
  },
];

if (process.env.LOGTAIL_SOURCE_TOKEN) {
  targets.push({
    target: "@logtail/pino",
    options: {
      sourceToken: process.env.LOGTAIL_SOURCE_TOKEN,
      options: {
        endpoint:
          process.env.LOGTAIL_INGESTING_HOST ||
          "https://in.logs.betterstack.com",
      },
    },
  });
}

const logger = pino({
  ...baseConfig,
  transport: { targets },
});

export { logger };
