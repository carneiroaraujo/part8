import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { Routes, Route, Link } from "react-router-dom"
import Recommend from "./components/Recommend";

const App = () => {
  const [token, setToken] = useState(null)
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])
  function handleLogout() {
    setToken(null)
    localStorage.clear()
    // TODO clear apollo cache
  }
  return (
    <div>
      <div>
        <Link to="/authors">authors</Link>
        <Link to="/books">books</Link>
        {
          token
            ?
            <>
              <Link to="/newbook">add book</Link>
              <Link to="/recommend">recommend</Link>
              <button onClick={handleLogout}>logout</button>
            </>
            :
            <>
              <Link to="/login">login</Link>
            </>
        }

      </div>
      <Routes>
        <Route path="/authors" element={<Authors token={token}/>} />
        <Route path="/books" element={<Books />} />
        <Route path="/newbook" element={<NewBook />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/login" element={<Login setToken={setToken}/>} />
      </Routes>

    </div>
  );
};

export default App;
