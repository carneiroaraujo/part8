import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
import { EDIT_NUMBER, ALL_PERSONS } from "../queries"

function useField() {
  const [value, setValue] = useState("")
  function onChange(event) {
    setValue(event.target.value)
  }
  return { value, onChange }
}


export default function PhoneForm({setError}) {
  const name = useField()
  const phone = useField()

  const [changeNumber, result] = useMutation(EDIT_NUMBER)

  function submit(event) {
    event.preventDefault()
    changeNumber({
      variables: {
        name: name.value,
        phone: phone.value,
      }
    })
  }
  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setError("person not found")
    }
  }, [result.data])

  return (
    <div>
      <h2>change number</h2>
      <form onSubmit={submit}>
        <div>name <input {...name} /></div>
        <div>phone <input {...phone} /></div>
        <button type="submit">change number</button>
      </form>
    </div>
  )
}