import { useQuery, useMutation } from "@apollo/client"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import { useState, useId } from "react"

const Authors = () => {
  const [name, setName] = useState("")
  const [born, setBorn] = useState("")

  const authorsQuery = useQuery(ALL_AUTHORS)
  const authors = authorsQuery.loading ? [] : authorsQuery.data.allAuthors

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  function handleAuthorSubmit(event) {
    editAuthor({
      variables: { name, born }
    })
    event.preventDefault()
    setName("")
    setBorn("")
  }


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>

      <form onSubmit={handleAuthorSubmit}>
       
          <select onChange={({ target }) => setName(target.value)}>
            {
              authors.map(a => (
                <option key={a.name} value={a.name}>{a.name}</option>
              ))
            }
          </select>
     
        <div>born <input value={born} onChange={({ target }) => { setBorn(Number(target.value)) }} /></div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
