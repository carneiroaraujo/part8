import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../queries"
import { useNavigate } from "react-router-dom"

function useField(type) {
  const [value, setValue] = useState("")
  function onChange({ target }) {
    setValue(target.value)
  }
  return { value, onChange, type }
}

export default function Login({ setToken }) {
  const username = useField("text")
  const password = useField("password")
  const [login, result] = useMutation(LOGIN)
  const navigate = useNavigate()

  function handleSubmit(event) {
    login({
      variables: {
        username: username.value,
        password: password.value,
      }
    })
    event.preventDefault()
  }
  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem("token", token)
      navigate("/books")
    }
  }, [result.data])

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={handleSubmit}>
        <div>username: <input {...username} /></div>
        <div>password: <input {...password} /></div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}