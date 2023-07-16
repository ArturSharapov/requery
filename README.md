# Requery 🦕
A tiny module for retrieving and validating queries (search params) from a given request, returning a strongly typed object of queries and their values.


## Usage
```ts
import { getQueries } from 'https://deno.land/x/requery@0.1.0/mod.ts'

getQueries(request, 'title', 'n:count', 'info?', 'n:ttl?', 'b:all', 'b:new')
// =>
{
  title: string,
  count: number,
  info?: string,
  ttl?: number
  all: boolean,
  new: boolean,
}

// https://example.com/?title=Dinosaur&count=5&ttl=26&all
// =>
{
  title: 'Dinosaur',
  count: 5,
  info: undefined,
  ttl: 26,
  all: true,
  new: false
}
```
### Partial queries
All queries are optional by default and are not included to the final object if they do not present in the request.
```ts
import { getPartialQueries } from 'https://deno.land/x/requery@0.1.0/mod.ts'

getPartialQueries(request, 'title', 'n:count', 'info', 'n:ttl', 'b:all', 'b:new')
// =>
{
  title?: string,
  count?: number,
  info?: string,
  ttl?: number
  all?: true,
  new?: true,
}

// https://example.com/?title=Dinosaur&count=5&ttl=26&all
// =>
{
  title: 'Dinosaur',
  count: 5,
  ttl: 26,
  all: true,
}
```
! Notice that `info` and `new` are not included.


## Examples
```ts
const request = new Request('https://example.com/?r=255&g=126&b=32&extra=not-picked')
getQueries(request, 'n:r', 'n:g', 'n:b')
// =>
{
  r: 255,
  g: 126,
  b: 32
}
```

```ts
const request = new Request('https://example.com/?red=255&green=126')
getQueries(request, 'n:red', 'n:green', 'n:blue')
// =>
// InvalidParamsError: Param 'blue' is missing
```

```ts
const request = new Request('https://example.com/?confirmed=ok')
getQueries(request, 'b:confirmed')
// =>
// InvalidParamsError: Param 'confirmed' is not a boolean
```
