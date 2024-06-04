import { useState } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_PERSON, ALL_PERSONS } from "../queries"
function useField() {
  const [value, setValue] = useState("")
  function onChange(event) {
    setValue(event.target.value)
  }
  return { value, onChange }
}


export default function PersonForm({setError}) {
  const name = useField()
  const phone = useField()
  const street = useField()
  const city = useField()

  const [createPerson] = useMutation(CREATE_PERSON, {
    // refetchQueries: [{query: ALL_PERSONS}],
    onError: error => {
      const messages = error.graphQLErrors.map(e => e.message).join("\n")
      setError(messages)
    },
    update: (cache, response) => {
      cache.updateQuery({query: ALL_PERSONS}, ({allPersons}) => {
        return {
          allPersons: allPersons.concat(response.data.addPerson)
        }
      })
    }
  })

  function submit(event) {
    event.preventDefault()
    createPerson({
      variables: {
        name: name.value,
        phone: phone.value || undefined,
        street: street.value,
        city: city.value,
      }
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>name <input {...name} /></div>
        <div>phone <input {...phone} /></div>
        <div>street <input {...street} /></div>
        <div>city <input {...city} /></div>
        <button type="submit">add!</button>
      </form>
    </div>
  )
}