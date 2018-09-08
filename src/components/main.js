import React from 'react';
import Editor from "./editor";
import Post from './post';
import Form from "./form";
import { subscribe } from "../service-worker";

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
