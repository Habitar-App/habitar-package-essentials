import { AppError } from "../classes"
import { validateSync } from "class-validator"

type Constructor<T = {}> = new (...args: any[]) => T

export function AutoValidate<T extends Constructor>(target: T): T {
  const className = target.name

  return class extends target {
    constructor(...args: any[]) {
      super(...args)

      const errors = validateSync(this)
      if (errors.length) {
        throw new AppError(
          `Fail when validate the class ${className}`,
          400,
          errors
        )
      }

      return new Proxy(this, {
        set: (object, key: any, value) => {
          const oldValue = (object as any)[key]
          ;(object as any)[key] = value

          const errors = validateSync(object)
          if (errors.length) {
            ;(object as any)[key] = oldValue
            throw new AppError(
              `Fail when validate the class ${className}`,
              400,
              errors
            )
          }

          return true
        },
      })
    }
  }
}
