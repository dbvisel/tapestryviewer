// app/routes/graphql.jsx

import { useLoaderData, json } from "remix"
import { GraphQLClient, gql } from "graphql-request"

const GET_CHARACTERS = gql`{
  characters {
    results {
      name
      id
    }
  }
}`

export let loader = async () => {
  const client = new GraphQLClient("https://rickandmortyapi.com/graphql")
  const { characters } = await client.request(GET_CHARACTERS)
  const { results } = characters
  return json({ results })
}

export default function Index() {
  let data = useLoaderData()

  return (
    <>
      <ul>
        {data.results.map(({ name, id }) => (
          <li key={id}>
            {name}
          </li>
        ))}
      </ul>
    </>
  )
}
