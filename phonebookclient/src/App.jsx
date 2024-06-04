import { useQuery, useApolloClient } from "@apollo/client"
import { useState } from "react"
import { ALL_PERSONS } from "./queries"
import Persons from "./components/Persons"
import PersonForm from "./components/PersonForm"
import PhoneForm from "./components/PhoneForm"
import LoginForm from "./components/LoginForm"


function Notify({ errorMessage }) {
  if (!errorMessage) return null
  return (
    <div style={{ color: "red" }}>
      {errorMessage}
    </div>
  )
}

function App() {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()
  function logout() {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage}></Notify>
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={setErrorMessage}/>
      </div>
    )
  }
  if (result.loading) {
    return <div>loading ...</div>
  }
  const persons = result.data.allPersons

  function notify(message) {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000);
  }
  return (
    <div>
      <Notify errorMessage={errorMessage}/>
      <button onClick={logout}>logout</button>
      <Persons persons={persons} />
      <PersonForm setError={notify}/>
      <PhoneForm setError={notify}/>
    </div>
  )
}

export default App
