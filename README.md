# Requery 🦕
🔎 A tiny module for retrieving and validating queries (search params) from a given request, returning a strongly typed object of queries and their values.

### Usage
```ts
getQueries(request, 'title', 'n:count', 'info?', 'b:all', 'n:ttl?')
// =>
{
  title: string,
  count: number,
  info?: string,
  all: boolean,
  ttl?: number
}
```

### Examples
```ts
const request = new Request('https://example.com/?title=Dinosaur&count=5&ttl=26&all')
getQueries(request, 'title', 'n:count', 'info?', 'b:all', 'n:ttl?')
// =>
{
  title: 'Dinosaur',
  count: 5,
  info: undefined,
  all: true,
  ttl?: 26
}
```

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
