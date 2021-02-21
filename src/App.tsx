import { useState } from "react";

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

function App() {
  const [joke, setJoke] = useState<Joke>();

  const handleGetJoke = async () => {
    const response = await fetch(
      "https://official-joke-api.appspot.com/jokes/general/random"
    );
    const jsonBody: Joke[] = await response.json();
    console.log("Received JSON body:", jsonBody);
    setJoke(jsonBody[0]);
  };

  if (joke) {
    return (
      <div>
        <h1>Joke app</h1>
        <details>
          <summary>{joke.setup}</summary>
          <p>{joke.punchline}</p>
        </details>
        <hr />
        <button onClick={handleGetJoke}>Get another joke</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Joke app</h1>
        <p>
          Click the button to trigger a <code>fetch</code> that gets a random
          joke from an API!
        </p>
        <button onClick={handleGetJoke}>Get joke</button>
      </div>
    );
  }
}

export default App;
