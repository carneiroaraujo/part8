import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { useState } from "react"
import BooksTable from "./BooksTable"


const Books = (props) => {
  const genres = []
  const [genreFilter, setGenreFilter] = useState("")
  console.log(genreFilter);
  const booksQuery = useQuery(ALL_BOOKS, {
    variables: {
      genre: genreFilter
    }
  })

  const books = booksQuery.loading ? [] : booksQuery.data.allBooks


  books.forEach(book => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
  });

  // const genres = books.map(book => book)

  return (
    <div>

      <BooksTable books={books}/>
      
      <div>
        <button onClick={() => setGenreFilter(null)}>all genres</button>
        {
          genres.map(genre => (
            <button key={genre} onClick={() => setGenreFilter(genre)}>{genre}</button>
          ))
        }
      </div>
    </div>
  )
}

export default Books
