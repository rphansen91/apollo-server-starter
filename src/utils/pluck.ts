export const pluckArgs = (n: number, fn: any) => (...args: any[]) => fn(...args.slice(n))
