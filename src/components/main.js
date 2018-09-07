import React from 'react';
import Editor from "./editor";
import Post from './post';
import Form from "./form";

const subscribe = async () => {
  const { subscribe } = await import("../service-worker/register");
  const data = await subscribe();
  await fetch('/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      data: JSON.stringify(data)
    }),
    credentials: 'same-origin',
    redirect: 'follow'
  })
}

export default ({ user, posts }) => (
  <div>
    <div>
      { user.user }
      <button onClick={subscribe}>Enable Notifications</button>
    </div>

    <Form method="post">
      <Editor name="content" value="" />
      <button>Submit</button>
    </Form>

    <div>
      {posts.map(post => (
        <Post
          post={post}
          key={post.id}
          reactionTypes={[]}
        />
      ))}
    </div>
  </div>
);
