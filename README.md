# Fetch in React

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's [technical curriculum for **The Mark**](https://github.com/WeAreAcademy/curriculum-mark). All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

We looked at We'll now look at how `fetch` can be used to load external data from an API into React.

## Learning Outcomes

- Load data from an API into React with `fetch` and `setState`
- Use conditional rendering in React

## Demo: fetching a joke

> 🎯 **Success criterion:** You can run the React app which fetches a joke in

This repo has an example React app which loads data from a joke API when a button is clicked.

There's a short delay between the button being clicked and the joke being loaded - because it takes some time for the transportation of data:

- HTTP Request: front-end asks for a joke from `https://official-joke-api.appspot.com/jokes/general/random`
- HTTP Response: the joke API server responds with a random joke

The `handleGetJoke` function has been written in both `async`/`await` style and Promise `.then` style. (Check that both work by commenting and de-commenting.)

## Exercise 1: showing a single random dog picture

> 🎯 **Success criterion:** Your React app loads in a new picture of a random dog of a _fixed given breed_ every time the button is clicked

Now, let's change our joke fetching app to a dog picture fetching app.

We'll use [this API](https://dog.ceo/dog-api/documentation/random).

Make the relevant changes to the React app so that you are `fetch`ing from this API (and rendering an image using the data received).

(It's up to you whether you use the `async`/`await` or `.then`!)

## Exercise 2: accumulating images

> 🎯 **Success criterion:** Your React app contains a growing collection of dog pictures, adding a new random one every time a button is clicked

Currently, we're fetching a new dog picture every time we click a button - and discarding the previous one.

Instead, let's start to build up a nice, growing collection of them instead.

It may be helpful here to look up previous demos for array state!
