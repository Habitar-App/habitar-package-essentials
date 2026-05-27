import pino, { LoggerOptions, StreamEntry } from "pino";
import pinoPretty from "pino-pretty";
import build from "pino-abstract-transport";
import { Logtail } from "@logtail/node";
import { LogLevel } from "@logtail/types";
import type { ILogtailOptions } from "@logtail/types";

const baseConfig: LoggerOptions = {
  level: (process.env.LOG_LEVEL as pino.LevelWithSilent) || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: process.env.SERVICE_NAME,
    env: process.env.NODE_ENV || "development",
  },
};

const RESERVED_LOG_KEYS = new Set(["time", "msg", "message", "level", "v"]);
const STACK_CONTEXT_HINT = {
  fileName: "node_modules/pino",
  methodNames: ["log", "fatal", "error", "warn", "info", "debug", "trace", "silent"],
  required: true,
};

function pinoLevelToLogtail(level: number): LogLevel {
  if (level <= 10) return LogLevel.Debug;
  if (level <= 20) return LogLevel.Debug;
  if (level <= 30) return LogLevel.Info;
  if (level <= 40) return LogLevel.Warn;
  if (level <= 50) return LogLevel.Error;
  return LogLevel.Fatal;
}

function createLogtailStream(
  sourceToken: string,
  options: Partial<ILogtailOptions>
) {
  const logtail = new Logtail(sourceToken, options);
  return build(
    async (source) => {
      for await (const obj of source as AsyncIterable<Record<string, unknown>>) {
        const meta: Record<string, unknown> = {};

        const time = obj.time as string | number | undefined;
        if (time !== undefined) {
          const dt = new Date(time);
          if (!Number.isNaN(dt.valueOf())) meta.dt = dt;
        }

        for (const key of Object.keys(obj)) {
          if (!RESERVED_LOG_KEYS.has(key)) meta[key] = obj[key];
        }

        const msg = (obj.msg ?? obj.message ?? "") as string;
        if (obj.msg !== undefined && obj.message !== undefined) {
          meta.message_field = obj.message;
        }

        logtail.log(
          msg,
          pinoLevelToLogtail(obj.level as number),
          meta,
          STACK_CONTEXT_HINT as never
        );
      }
    },
    { close: async () => { await logtail.flush(); } }
  );
}

const streams: StreamEntry[] = [];

if (process.env.NODE_ENV !== "production") {
  streams.push({
    stream: pinoPretty({
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
      singleLine: true,
    }),
  });
}

if (process.env.LOGTAIL_SOURCE_TOKEN) {
  streams.push({
    stream: createLogtailStream(process.env.LOGTAIL_SOURCE_TOKEN, {
      endpoint:
        process.env.LOGTAIL_INGESTING_HOST ||
        "https://in.logs.betterstack.com",
    }),
  });
}

const logger =
  streams.length > 0
    ? pino(baseConfig, pino.multistream(streams))
    : pino(baseConfig);

export { logger };
