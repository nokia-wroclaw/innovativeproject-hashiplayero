import React, { Component, Suspense } from "react";

import { ThemeProvider } from "@emotion/react";
import lightTheme from "./theme/lightTheme";

import HeaderBar from "./components/HeaderBar";
import { Routes, Route } from "react-router-dom";
import SinglePlay from "./pages/SinglePlay";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import FindRoom from "./pages/FindRoom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Rules from "./pages/Rules";
import Game from "./pages/Game";
import Websocket from "./store/Websocket";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={lightTheme}>
      <div className="main">
        <HeaderBar />
        <Websocket />
        <div className="main-content">
          <main className="column">
            <Suspense fallback={<div>Loading...</div>}></Suspense>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/singleplay" element={<SinglePlay />} ></Route>
              <Route path="/singleplay/:roomId" element={<Game />} />
              <Route path="/createroom" element={<CreateRoom />} />
              <Route path="/findroom" element={<FindRoom />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rules" element={<Rules />} />
            </Routes>
          </main>
        </div>
      </div>
      </ThemeProvider>
    );
  }
}

export default App;
