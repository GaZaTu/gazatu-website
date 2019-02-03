declare var module: any
declare var process: { env: { NODE_ENV: "development" | "production" } }

declare module "classnames" {
  export = classNames

  function classNames(...args: (string | { [key: string]: any } | boolean | null | undefined)[]): string

  namespace classNames { }
}
