const { ApolloServer } = require("@apollo/server")
const { v1: uuid } = require("uuid")
const { startStandaloneServer } = require("@apollo/server/standalone")
const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const mongoose = require("mongoose")
const Person = require("./models/person")
const User = require("./models/user")

mongoose.set("strictQuery", false)

require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI
console.log("Connection to", MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.log("Error connecting to MongoDB:", error.message);
  })



let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

const typeDefs = `

enum YesNo {
  YES
  NO
}
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Address {
  street: String!
  city: String!
}

type Person {
  name: String! 
  phone: String
  address: Address!
  id: ID!
}

type Query {
  me: User
  personCount: Int!
  allPersons(phone: YesNo): [Person!]!
  findPerson(name: String!): Person
}

type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
  editNumber(
    name: String!
    phone: String!
  ): Person
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
  addAsFriend(
    name: String!
  ): User
}
`
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      // console.log(args.phone);
      if (!args.phone) {
        return Person.find({})
      }

      return Person.find({ phone: { $exists: args.phone === YES } })
    },
    findPerson: (root, args) => Person.findOne({ name: args.name }),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Person: {
    address: (root) => { return { city: root.city, street: root.street } }
  },
  Mutation: {
    addPerson: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          }
        })
      }

      const person = new Person({ ...args })
      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError("Saving user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          }
        })
      }
      return person

    },
    editNumber: async (root, args) => {
      const person = Person.findOne({ name: args.name })
      person.phone = args.phone
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError("Saving number failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error
          }
        })
      }
      if (!person) {
        return null
      }
      const updatedPerson = { ...person, phone: args.phone }
      persons = persons.map(person => person.name === updatedPerson.name ? updatedPerson : person)
      return updatedPerson

    },
    createUser: async function (root, args) {
      const user = new User({ username: args.username })
      return user.save()
        .catch(error => {
          throw new GraphQLError("Creating the user failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT"
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addAsFriend: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" }
        })
      }
      const person = await Person.findOne({ name: args.name })
      const personId = person._id.toString()
      const isFriend = currentUser.friends.some(friend => friend._id.toString() === personId)
      if (!isFriend) {
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      }
      return currentUser

    }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    // console.log(auth);
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate("friends")
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
})
