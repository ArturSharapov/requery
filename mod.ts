export class InvalidParamsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Retrieve and validate queries from the request, returning a strongly typed object of queries.
 * @param request The request to retrieve queries from
 * @param queries List of queries to retrieve (prefix: `n:`|`b:`, postfix: `?`)
 */
export function getQueries<A extends string>(request: Request, ...queries: A[]) {
  const url = new URL(request.url);
  const result: Record<string, unknown> = {};
  for (const query of queries) {
    const match = query.match(/^((n|b):)?(.+?)(\?)?$/);
    if (!match) throw new InvalidParamsError(`Invalid query '${query}'`);
    const [, , type, name, optional] = match;
    const param = url.searchParams.get(name);
    if (type === 'b') {
      if (param && param !== '') throw new InvalidParamsError(`Param '${name}' is not a boolean`);
      result[name] = param === '';
      continue;
    }
    if (param === null) {
      if (!optional) throw new InvalidParamsError(`Param '${name}' is missing`);
      result[name] = undefined;
      continue;
    }
    if (type === 'n') {
      const numeric = +param;
      if (isNaN(numeric)) throw new InvalidParamsError(`Param '${name}' is not a number`);
      result[name] = numeric;
      continue;
    }
    result[name] = param;
  }
  type PShort = { n: number; s: string; b: boolean };
  type PName<S extends string> = S extends `${keyof PShort}:${infer C}` ? C : S;
  type POName<S extends string> = PName<S extends `${infer C}?` ? C : S>;
  type PType<S extends string> = PShort[S extends `${infer T}:${string}` ? T : 's'];
  type POType<S extends string> = S extends `${string}?` ? PType<S> | undefined : PType<S>;
  return result as { [a in A as POName<a>]: POType<a> };
}
