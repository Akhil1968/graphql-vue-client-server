const express = require('express')
const { graphql, buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const Champion = require('./champion')
 
const schema = buildSchema(`
  type Query {
    language: String
    getChampions: [Champion]
    getChampionByName(name: String!): Champion
  }

  type Mutation {
    updatePower(name: String!, power: Float): Champion
  }

  type Champion {
    name: String
    power: Float
  },

  type ChampionDetail {
    name: String
    power: Float
  }
`)

const champions = [
  new Champion('Tom', 100),
  new Champion('Jerry', 200),
  new Champion('Mickey Mouse', 150),
  new Champion('Donald Duck', 200),
  new Champion('Batman', 120),
  new Champion('Superman', 300)
]

const rootValue = {
  language: () => 'GraphQL',

  getChampions: () => champions,

  getChampionByName: ({ name }) => {
    return champions.find(x => x.name === name)
  },

  updatePower: ({ name, power = 150 }) => {
    const champion = champions.find(x => x.name === name)
    champion.power = power

    return champion
  }
}

const app = express()
app.use(cors())

app.use('/graphql', graphqlHTTP({
  rootValue, schema, graphiql: true
}))

app.listen(4000, () => console.log('Listening on 4000'))
