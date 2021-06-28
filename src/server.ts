import { PrismaClient } from '@prisma/client'
import { ApolloServer, gql, IResolvers } from 'apollo-server'

const prisma = new PrismaClient()

const typeDefs = gql`
    type User {
        email: String!
        name: String
    }

    type Query {
        allUsers: [User!]!
    }
`

const resolvers: IResolvers = {
    Query: {
        allUsers: () => {
            return prisma.user.findMany()
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        prisma,
    },
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
