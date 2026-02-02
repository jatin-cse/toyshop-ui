import { useState } from "react";
import Login from "./Login";
import ToyApp from "./ToyApp";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return <ToyApp />;
}

export default App;
