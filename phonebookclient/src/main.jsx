import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import {ApolloClient, ApolloProvider, InMemoryCache, gql} from "@apollo/client"


const client = new ApolloClient({
  // uri: "http://localhost:4000",
  uri: "http://10.0.0.20:4000",
  cache: new InMemoryCache(),
})
// const query = gql`
// query {
//   allPersons {
//     name,
//     phone,
//     address {
//       street,
//       city
//     }
//     id
//   }
// }
// `

// client.query({query})
// .then(({data}) => {
//   console.log(data);
// })
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
