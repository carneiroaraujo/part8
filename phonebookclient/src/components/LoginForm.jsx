import { useMutation } from "@apollo/client"
import { LOGIN } from "../queries"
import { useEffect, useState } from "react"
function useField(type) {
  const [value, setValue] = useState("")
  function onChange({ target }) {
    setValue(target.value)
  }
  return { value, onChange, type }
}
export default function LoginForm({ setToken, setErrorMessage }) {

  const username = useField("text")
  const password = useField("password")
  const [login, result] = useMutation(LOGIN, {
    onError: error => {
      setErrorMessage(error.graphQLErrors[0].message)
    }
  })
  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem("phonenumbers-user-token", token)
    }
  }, result.data)
  function handleSubmit(event) {
    event.preventDefault()
    login({variables: {
      username: username.value, 
      password: password.value
    }})
  }
  return (
    <>

      <form onSubmit={handleSubmit}>
        <div>username: <input {...username} /></div>
        <div>password: <input {...password} /></div>
        <button type="submit">login</button>
      </form>
    </>
  )
}