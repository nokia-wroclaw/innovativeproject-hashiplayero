import React, { Component, Suspense } from "react";
import HeaderBar from "./components/HeaderBar";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import SinglePlay from "./SinglePlay/SinglePlay";
import Dashboard from "./Dashboard/Dashboard";
import CreateRoom from "./CreateRoom/CreateRoom";
import FindRoom from "./FindRoom/FindRoom";
import SignUp from "./SignUp/SignUp";
import SignIn from "./SignIn/SignIn";
import Faq from "./Faq/Faq";
import Contact from "./Contact/Contact";
import Rules from "./Rules/Rules";

class App extends Component {
  render() {
    return (
      <div>
        <HeaderBar />
        <div className="section columns">
          <NavBar />
          <main className="column">
            <Suspense fallback={<div>Loading...</div>}></Suspense>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/singleplay" element={<SinglePlay />} />
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
    );
  }
}

export default App;
