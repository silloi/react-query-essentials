import React from 'react'
import Link from 'next/link'
import { useQuery, useMutation, queryCache } from 'react-query'

import axios from 'axios'

import PostForm from '../components/PostForm'

export default function Posts() {
  const postsQuery = useQuery('posts', () =>
    axios.get('/api/posts').then((res) => res.data)
  )

  const [createPost, createPostInfo] = useMutation(
    (values) => axios.post('/api/posts', values),
    {
      onMutate: (values) => {
        queryCache.calcelQueries('posts')

        const oldPosts = queryCache.getQueryData('posts')

        queryCache.setQueryData('posts', (oldPosts) => {
          return [
            ...oldPosts,
            {
              ...values,
              id: Date.now(),
            },
          ]
        })

        return () => queryCache.setQueryData('posts', oldPosts)
      },
      onError: (error, values, rollback) => {
        if (rollback) {
          rollback()
        }
      },
      onSettled: () => queryCache.invalidateQueries('posts'),
    }
  )

  return (
    <section>
      <div>
        <div>
          {postsQuery.isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
              <ul>
                {postsQuery.data.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
              <br />
            </>
          )}
        </div>
      </div>

      <hr />

      <div>
        <h3>Create New Post</h3>
        <div>
          <PostForm
            onSubmit={createPost}
            clearOnSubmit
            submitText={
              createPostInfo.isLoading
                ? 'Saving...'
                : createPostInfo.isError
                ? 'Error!'
                : createPostInfo.isSuccess
                ? 'Saved!'
                : 'Create Post'
            }
          />
          {createPostInfo.isError ? (
            <pre>{createPostInfo.error.response.data.message}</pre>
          ) : null}
        </div>
      </div>
    </section>
  )
}
