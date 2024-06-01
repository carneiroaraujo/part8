import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

import { useQuery, gql } from "@apollo/client"
import { Routes, Route, Link } from "react-router-dom"

const App = () => {

  return (
    <div>
      <div>
        
        <Link to="/authors">authors</Link>
        <Link to="/books">books</Link>
        <Link to="/newbook">add book</Link>
      </div>
      <Routes>
        <Route path="/authors" element={<Authors/>}/>
        <Route path="/books" element={<Books/>}/>
        <Route path="/newbook" element={<NewBook/>}/>
      </Routes>


      {/* <NewBook show={page === "add"} /> */}
    </div>
  );
};

export default App;
