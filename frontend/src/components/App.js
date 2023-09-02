import React, { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ChatContainer from "./ChatContainer";
import Login from "./Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  function logout() {
    setLoggedIn(false);
  }

  function login() {
    setLoggedIn(true);
  }

  return (
    <div>
      <Header loggedIn={loggedIn} logout={logout} />
      {!loggedIn ? <Login login={login} /> : <ChatContainer />}
      <Footer />
    </div>
  );
}

export default App;
