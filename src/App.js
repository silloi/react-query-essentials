import React from 'react'
import { useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import axios from 'axios'

// user email: 'Sincere@april.biz'
// https://jsonplaceholder.typicode.com/users?email=${email}

// https://jsonplaceholder.typicode.com/users?userId=${userId}

const email = 'Sincere@april.biz'

function MyPosts() {
  const userQuery = useQuery('user', () =>
    axios
      .get(`https://jsonplaceholder.typicode.com/users?email=${email}`)
      .then((res) => res.data[0])
  )

  const postsQuery = useQuery(
    'posts',
    () =>
      axios
        .get(
          `https://jsonplaceholder.typicode.com/users?userId=${userQuery.data.userId}`
        )
        .then((res) => res.data),
    {
      enabled: userQuery.data?.id,
    }
  )

  return userQuery.isLoading ? (
    'Loading user...'
  ) : (
    <div>
      <div>User Id: {userQuery.data.id}</div>
      <br />
      <br />
      {postsQuery.isIdle ? null : postsQuery.isLoading ? (
        'Loading posts...'
      ) : (
        <div>Post Count: {postsQuery.data.length}</div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div>
      <MyPosts />
      <ReactQueryDevtools />
    </div>
  )
}
