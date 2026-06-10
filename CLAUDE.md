# CLAUDE.md — habitar-package-essentials

**Pacote compartilhado `@habitar/essentials` — fundação de todos os serviços.** Logger padronizado (pino → stdout pretty + Better Stack/Logtail), classe de erro operacional (`AppError`), extração/normalização de erros, redatores de headers sensíveis e decorators de validação BR. Mudanças aqui afetam **todos** os serviços — versione com cuidado e atualize o changelog de consumo.

## Stack & publicação

- TypeScript puro, bundle com **bunchee** (gera `.js` + `.mjs` + tipos em `dist/`).
- Deps: `pino`, `@logtail/pino`, `pino-pretty`, `class-validator`, `validations-br`.
- Publicado no **GitHub Packages** como `@habitar/essentials` (consumido por todos os serviços).

## Comandos

```bash
bun install
bun run build      # bunchee
bun test           # bun test
```

## Exports (src/index.ts)

| Export | O que é |
| --- | --- |
| `logger` | pino com dual stream: stdout pretty (fora de produção) + Logtail se `LOGTAIL_SOURCE_TOKEN` setado |
| `AppError` | `new AppError(message, statusCode=400, errors?, code?)` — erro **intencional** (vira warn nos serviços) |
| `extractError(err)` | normaliza AppError/AxiosError/Error → `{ message, errors[], statusCode, isOperational, stack? }` |
| `AutoValidate` | decorator de classe (Proxy): valida na construção e em cada set; lança AppError |
| `IsValidPhone` / `IsValidZipCode` | validators class-validator usando `validations-br` |
| `redactAuthHeader(auth)` | trunca tokens para 12 chars + "…" |
| `redactSensitiveHeaders(headers)` | redige authorization, cookie, set-cookie, x-api-key, api-key, x-auth-token |
| `mergeObjects` / `splitByDots` | deep merge; `"a.b.c"` → `{a:{b:{c:value}}}` |
| `ExtractedError` (type) | shape do retorno de `extractError` |

## Logger — env vars

`SERVICE_NAME` (obrigatória — campo `service` em todo log), `NODE_ENV` (production desliga o pretty), `LOG_LEVEL` (default info), `LOGTAIL_SOURCE_TOKEN`, `LOGTAIL_INGESTING_HOST`.

## Estrutura

```
src/
  index.ts         # barrel de exports
  classes/         # AppError
  decorators/      # AutoValidate, ValidatePhone, ValidateZipCode
  functions/       # extractError, mergeObjects, redactAuthHeader, splitByDots
  logs/            # Logger (pino dual-stream)
```

## Gotchas

- `extractError` achata árvores de `ValidationError` aninhadas em `string[]` — preserve esse contrato.
- Os redatores são intencionalmente destrutivos (segurança em logs): nunca "melhore" devolvendo o valor completo.
- Breaking change aqui = atualizar e republicar antes de subir os serviços que dependem da nova API.

## Logging

@LOGGING.md
