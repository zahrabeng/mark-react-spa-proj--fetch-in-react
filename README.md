# Fetch in React

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's [technical curriculum for **The Mark**](https://github.com/WeAreAcademy/curriculum-mark). All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

We'll now look at how `fetch` can be used to load external data from an API into React.

## Learning Outcomes

- Load data from an API into React with `fetch` and `setState`
- Use conditional rendering in React

## Demo 0: fetching a joke

> 🎯 **Success criterion:** You can see the results of `fetch`ing data from an API in your terminal

`fetch` is a function which is commonly used to get data from an existing API into a front-end app. (It is available by default in modern browsers. Outside the browser environment, in Node, we're using the [`node-fetch` library](https://github.com/node-fetch/node-fetch) to simulate it.)

In this demo, we'll be using it to get data from [this joke API](https://github.com/15Dkatz/official_joke_api). If you open the documented links in your browser (e.g. ["Grab a random joke!"](https://official-joke-api.appspot.com/random_joke)), you'll see a JSON response such as:

```json
{
  "id": 195,
  "type": "general",
  "setup": "What did the shy pebble wish for?",
  "punchline": "That she was a little boulder."
}
```

By drawing on APIs, we can load data (like jokes, [dog pictures](https://dog.ceo/dog-api/) or [Kanye West quotes](https://kanye.rest/)) into our front-end apps.

### Using `fetch`

`fetch` returns a Promise, which means we can either use a `.then` callback on it, or `await` it.

Demo 0 shows the recipe for extracting the core response data from an API, in both the `.then` style and the `async`/`await` style. Try running the demo with `ts-node` and see what prints in your terminal (for both styles).

Then, try substituting the joke API url with:

- `https://dog.ceo/api/breeds/image/random`
- `https://api.kanye.rest/`

and see what comes back again.

## Demo 1: type unsafety of `fetch`

> 🎯 **Success criterion:** You can explain the lack of type safety in `any` and in `fetch`

We've been using TypeScript and enjoying the benefits of static type safety which it gives to us, which [ordinary JavaScript lacks](https://github.com/WeAreAcademy/mark-fundamentals-proj--ts-hello-typescript).

For example, in demo 1's `printExampleJoke`, TypeScript stops us from trying to read the `setup` and `punchline` properties of our `jokeResponse` variable - it can see that it's an array. However, it will let us read `jokeResponse[0].setup` and `jokeResponse[1].punchline` - so, comment out the line with type errors, run the demo, and you'll see our joke output in the terminal.

Unfortunately... we get no such help from TypeScript in `printGeneralJoke` and `printProgrammingJoke`, when we `fetch` data from the Joke API. If you try running either, you'll see `undefined` get spit out into the terminal.

Why is it printing `undefined`? If you de-comment the debugging `console.log`s in the functions and try the functions running again, you'll see that it prints out a structure which looks very similar to `jokeResponse` - an array with one element, an object, which has the `setup` and `punchline` properties. So, just like with `printExampleJoke`, we should be reading and printing `json[0].setup` and `jsonBody[0].punchline`.

But why didn't TypeScript warn us that we were doing something wrong like it did with `printExampleJoke`?

### The (dangerous!) `any` type: anything goes

To understand this behaviour, we'll need to look at `any` - a type that you might have come across, but which we've tried to avoid using, because [using the `any` type usually represents bad practice](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html#any).

Replace the start of our `jokeResponse` variable definition as follows:

```diff
+ const jokeResponse: any = [
- const jokeResponse = [
  {
    id: 117,
    type: "general",
    setup: "How come the stadium got hot after the game?",
    punchline: "Because all of the fans left.",
  },
];
```

Now, TypeScript will no longer catch the mistake in `console.log(jokeResponse.setup, jokeResponse.punchline)`. In fact, it'll let you do all sorts of weird things, like `jokeResponse + 1` or `jokeResponse("hello world!")`.

In other words, the `any` type is a reckless _"anything goes!"_ type. We can see that `jokeResponse` is an array, which means it's enormously silly to try to read a `.setup` property, add `1` to it or execute it with an argument of `"hello world!"` - but, by asking TypeScript to treat it as `any`, it's letting us do all manner of silly things.

### The typing of `fetch`

[`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is typed to return `Promise<Response>`. This means that:

1. The `.then` callback on a `fetch` result can take a `Response` type argument
2. `await`ing a `fetch` returns a `Response` type

which you will be able to see by hovering over the `response` variable in both `printGeneralJoke` and `printProgrammingJoke`.

A [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) object has a [`.json()` method](https://developer.mozilla.org/en-US/docs/Web/API/Body/json), which is typed to return `Promise<any>`. This means that:

1. The `.then` callback on a `Response.json()` result takes `any` as an argument
2. `await`ing a `fetch` returns an `any` type

which is why, when you hover over `jsonBody`, you'll see that it is typed as `any`.

So, because of that, TypeScript's compiler won't spot or warn you about doing all sorts of silly things which will lead to JavaScript problems and bugs.

### Why is `Response.body()` typed as `any`?

We've just said that `any` is a really dangerous type which we should try to avoid.

So, why is `Response.body()` typed as `any`?

Well, we saw in Exercise 0 that `fetch` can get data from an arbitrary API, which can come back in very different forms and shapes. For example, [PokéApi](https://pokeapi.co/) returns JSON data that has entirely different properties to the Joke API.

What this means is that `fetch("https://official-joke-api.appspot.com/jokes/general/random")` and `fetch("https://pokeapi.co/api/v2/pokemon/ditto")` are ultimately going to return very different shapes of data - but it's impossible for us to know purely from the URL what form of data we might get back.

All that TypeScript can see is a `fetch` and a string URL - which means that TypeScript is also in the dark about what shape of data is going to come back.

Now, there is a type for this - the [`unknown` type](https://www.typescriptlang.org/docs/handbook/basic-types.html#unknown), which is intended _exactly_ for this purpose of 'who knows what this is - be careful with it!'.

`Promise<unknown>` would be a _great_ return typing for `Response.json()`. Unfortunately, it's typed as `Promise<any>`.

_Speculatively_, the reason for this might be that `unknown` is a new-ish type in TypeScript ([released in version 3.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type))...

> TypeScript 3.0 introduces a new top type `unknown`. `unknown` is the type-safe counterpart of `any`.

... and, in the (previous) absence of `unknown`, `any` was the best that could be managed - and now, with different codebases built around `fetch` being typed as `any`, it's now considered too harmful to change it to the (more appropriate type) of `unknown` (which would break a lot of existing code).

It is possible to [write a utility function that's a type-safe version of `fetch`](https://www.carlrippon.com/type-safe-data-fetching-with-unknown/), using the `unknown` type.

We're not going to do this now - for now, we'll simply encourage you to have _healthy scepticism_ about the `any` typing of the JSON body you get back from `fetch`, because _it is not type-safe_.

### Avoiding the temptation of `any`

It can be very tempting to reach for `any` to make a TypeScript error go away - but you're not really fixing the problem if you do this. TypeScript errors are warning us about things which are likely to cause bugs or break in production. The `any` type is a bit like closing your eyes, sticking your hands over your ears and going "LA LA LA I CAN'T HEAR OR SEE ANY PROBLEMS LALALA ALL IS FINE" - it doesn't actually treat the underlying issue.

For more on avoiding the use of `any`, read ["TypeScript: stop using `any`, there's a type for that"](https://thoughtbot.com/blog/typescript-stop-using-any-there-s-a-type-for-that).

## Demo 2: narrowing `fetch`

> 🎯 **Success criterion:** You can narrow the `any` resolve value from `Response.json()`

One possible strategy for dealing with `fetch`'s typing (or ultimate typing in `Response.json()`) is to manually narrow it down, as shown in demo 2.

If, by inspecting the documentation and/or making some sample requests, we know that `jsonBody` follows a certain structure, we can declare that type - as we have with the `Joke` interface and the `Joke[]` type given to `jsonResponse`. This is narrower than `any` - we can't read `jsonResponse.setup` and `jsonResponse.punchline`, but we _can_ read `jsonResponse[0].setup` and `jsonResponse[0].punchline`.

This isn't a perfect solution - it's still not entirely type-safe.

Since the resolve type of `Response.json()` is `any`, we can narrow it down to _anything_ - we happen to have chosen `Joke[]` (which matches our API response), but it would also have let us narrow it down to all of the below:

- `boolean`
- `{ firstName: string; lastName: string; }`
- `string[]`
- `number[][]`

none of which would have been correct (but all of which would have been allowed).

(Try it with all of these!)

So, if you use this strategy, you need to make sure that you are very very confident that you are accurately narrowing down the `any` type, because TypeScript won't be able to tell and warn you if you're not doing it accurately!
