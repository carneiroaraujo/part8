import { useQuery } from "@apollo/client"
import {useState} from "react"
import { FIND_PERSON } from "../queries"

function Person({person, onClose}) {
  return (
    <div>
      <h2>{person.name}</h2>
      <div>
        {person.address.street} {person.address.city}
      </div>
      <div>{person.phone}</div>
      <button onClick={onClose}>close</button>
    </div>
  )
}
export default function Persons({persons}) {
  const [nameToSearch, setNameToSearch] = useState()
  const result = useQuery(FIND_PERSON, {
    variables: {nameToSearch},
    skip: !nameToSearch
  })
  if (result.data && nameToSearch) {
    return (
      <Person person={result.data.findPerson} onClose={() => setNameToSearch(null)}/>
    )
  }
  return (
    <div>
      <h2>Persons</h2>
      {persons.map(p => (
        <div>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}>show address</button>
        </div>
      ))}
    </div>
  )
}