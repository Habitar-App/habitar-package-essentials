import { HttpConnection } from "@elastic/elasticsearch";
import pino from "pino";
import pinoElasticsearch from "pino-elasticsearch";
import pinoPretty from "pino-pretty";

const baseConfig = {
  level: (process.env.LOG_LEVEL as any) || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: process.env.SERVICE_NAME,
    env: process.env.NODE_ENV || "development",
  },
};

const prettyStream = pinoPretty({
  colorize: true,
  translateTime: "SYS:standard",
  ignore: "pid,hostname",
  hideObject: true,
});

const streamToElastic = pinoElasticsearch({
  index: `logs-${process.env.SERVICE_NAME}`,
  node: process.env.ELASTICSEARCH_URL,
  esVersion: 8,
  flushBytes: 1000,
  flushInterval: 30000,
  Connection: HttpConnection as any,
  opType: "create",
});

const logger = pino(
  baseConfig,
  pino.multistream([{ stream: streamToElastic }, { stream: prettyStream }])
);

export { logger };
