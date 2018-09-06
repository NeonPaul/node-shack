import React from 'react';
import Editor from "./editor";
import Post from './post';
import Form from "./form";

export default ({ user, posts }) => (
  <div>
    { user.user }

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
