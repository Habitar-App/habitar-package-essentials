# Padrão de Logs — habitar-package-essentials

Este pacote expõe o `logger` (pino) usado pelos serviços do Habitar. Toda a stack de logs (formato, transporte, sanitização) é centralizada aqui.

## Stack

- **Engine**: [pino](https://github.com/pinojs/pino)
- **Pretty (stdout)**: `pino-pretty` (sempre habilitado)
- **Transporte remoto**: `@logtail/pino` (Better Stack / Logtail). Substituiu `pino-elasticsearch` — o Elastic perdia logs importantes.

## Variáveis de ambiente

| Variável                 | Obrigatória? | Descrição                                                           |
| ------------------------ | ------------ | ------------------------------------------------------------------- |
| `SERVICE_NAME`           | Sim          | Nome do serviço. Vai em todo log como `service`.                    |
| `NODE_ENV`               | Não          | Default `development`. Vai em todo log como `env`.                  |
| `LOG_LEVEL`              | Não          | Default `info`. Aceita `trace`/`debug`/`info`/`warn`/`error`/`fatal`. |
| `LOGTAIL_SOURCE_TOKEN`   | Não*         | Token Better Stack. **Sem ele o envio remoto fica desligado**.       |
| `LOGTAIL_INGESTING_HOST` | Não          | Endpoint customizado do Better Stack (cada source tem o seu).        |

\* Em produção é obrigatório. Em desenvolvimento, deixar vazio é OK — apenas o stdout pretty fica ativo.

## Como usar

```ts
import { logger } from "@habitar/essentials"

logger.info({ realstateUid: "1234" }, "Realstate 1234 was published on instagram")
logger.warn({ statusCode: 400, errors }, "POST /foo rejected (400): invalid body")
logger.error({ err: { message, stack } }, "POST /foo unhandled: connection refused")
```

## Níveis (regra global)

- **info** — fluxo esperado: request recebida, response enviada, mensagem consumida, publicação OK.
- **warn** — erros **intencionais** (instâncias de `AppError`, validações que falham, rejeições de fila por payload inválido).
- **error** — erros **inesperados** (exceções não tratadas, falhas de upstream sem `AppError`, conexões caídas).
- **debug/trace** — apenas em desenvolvimento.

## Convenções de mensagem

1. Sempre inclua um identificador relevante na string: `Realstate 1234 was published on instagram`, `User 4321 updated company 555`, etc.
2. Use o primeiro argumento (objeto) para dados estruturados; segundo argumento para a mensagem em texto.
3. Nunca exponha tokens completos. Use `redactAuthHeader`/`redactSensitiveHeaders` deste mesmo pacote para tratar headers sensíveis.
4. Use `extractError(err)` para normalizar erros antes de logar.

## Build

```bash
bun install
bun run build
```

O `dist/` é publicado como `@habitar/essentials` para os serviços.
