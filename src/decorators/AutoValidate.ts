import { AppError } from "../classes"
import { validateSync } from "class-validator"

export const AutoValidate: any = (target: any) => {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)
      const errors = validateSync(this)
      if (errors.length) {
        throw new AppError("Fail when validate", 400, errors)
      }
      return new Proxy(this, {
        set: (object, key: any, value, proxy) => {
          const oldValue = object[key]
          object[key] = value
          const errors = validateSync(object)
          if (errors.length) {
            object[key] = oldValue
            throw new AppError("Fail when validate", 400, errors)
          }
          return true
        },
      })
    }
  }
}
