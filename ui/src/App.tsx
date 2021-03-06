import React, { Component, Suspense } from "react";

import { ThemeProvider } from "@emotion/react";
import lightTheme from "./theme/lightTheme";

import HeaderBar from "./components/HeaderBar";
import { Routes, Route } from "react-router-dom";
import SinglePlay from "./pages/SinglePlay";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import FindRoom from "./pages/FindRoom";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Rules from "./components/Rules";
import Game from "./pages/Game";
import WaitingRoom from "./pages/WaitingRoom";
import WebSocketComp from "./store/WebSocketComp";
import Footer from "./components/Footer";
import { PageNotFound } from "./components/svg/VectorGraphics";

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={lightTheme}>
        <div className="body">
          <HeaderBar />
          <WebSocketComp />
          <div className="main-content">
            <Suspense fallback={<div>Loading...</div>}></Suspense>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/singleplay" element={<SinglePlay />} />
              <Route path="/singleplay/:roomId" element={<Game />} />
              <Route path="/createroom" element={<CreateRoom />} />
              <Route path="/findroom" element={<FindRoom />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rules" element={<Rules />} />
              <Route
                path="/waitingroom/:waitingroomId"
                element={<WaitingRoom />}
              />
              <Route path="/multiplayer/:roomId" element={<Game />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
