import { useQuery } from "@apollo/client"
import { ME, ALL_BOOKS } from "../queries"
import { useEffect } from "react"
import BooksTable from "./BooksTable"
function BookList({}) {

}
export default function Recommend() {
  const meQuery = useQuery(ME)
  const favoriteGenre = meQuery.loading ? null : meQuery.data.me.favoriteGenre
  const booksQuery = useQuery(ALL_BOOKS, {variables: {genre: favoriteGenre}})
  const books = booksQuery.loading ? [] : booksQuery.data.allBooks

  return (
    <div>books in your favorite genre <b>{favoriteGenre}</b> <div>
    <BooksTable books={books}/>
    </div>
    </div>
  )
}