import React from 'react';
import Editor from "./editor";

import Post from './post';

export default ({ user, posts }) => (
  <div>
    { user.user }

    <form method="post">
      <Editor name="content" value="" />
      <button>Submit</button>
    </form>

    <div>
      {posts.map(post => (
        <Post
          post={post}
          key={post.id}
          reactionTypes={[{
            icon: '+1',
            verb: 'Like'
          }]}
        />
      ))}
    </div>
  </div>
);
