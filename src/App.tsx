import { useState } from "react";

interface Dog {
  message: string;
  status: string;
}

function App() {
  const [dog, setDog] = useState<Dog>();

  const handleGetdog = async () => {
    const response = await fetch(
      "https://dog.ceo/api/breeds/image/random"
    );
    const jsonBody: Dog = await response.json();
    setDog(jsonBody);
    console.log(jsonBody.message, jsonBody.status)
  };

  // const handleGetdog = () => {
  //   fetch("https://dog.ceo/api/breeds/image/random")
  //     .then((response) => response.json())
  //     .then((jsonBody: Dog) => setDog(jsonBody));
  // };

  if (dog) {
    return (
      <div>
        <h1>dog app</h1>
        <img src={dog.message} alt="random Dog " />s
        <details>
          <summary>{dog.message}</summary>
          <p>{dog.status}</p>
        </details>
        <hr />
        <button onClick={handleGetdog}>Get another dog</button>
       
      </div>
    );
  } else {
    return (
      <div>
        <h1>dog app</h1>
        <p>
          Click the button to trigger a <code>fetch</code> that gets a random
          dog from an API!
        </p>
        
        <button onClick={handleGetdog}>Get dog</button>
      </div>
    );
  }
}

export default App;
