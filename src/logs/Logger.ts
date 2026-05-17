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

const streams = [
  { stream: prettyStream },
];
if(!process.env.ELASTICSEARCH_URL) {
  const streamToElastic = pinoElasticsearch({
    index: `logs-${process.env.SERVICE_NAME}`,
    node: process.env.ELASTICSEARCH_URL,
    auth: {
      username: `${process.env.ELASTICSEARCH_USERNAME}`,
      password: `${process.env.ELASTICSEARCH_PASSWORD}`,
    },
    esVersion: 8,
    flushBytes: 1000,
    flushInterval: 30000,
    Connection: HttpConnection as any,
    opType: "create",
  });
  streams.push({ stream: streamToElastic });
}

const logger = pino(
  baseConfig,
  pino.multistream(streams)
);

export { logger };
