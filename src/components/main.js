import React from 'react';
import Editor from "./editor";
import Post from './post';
import Form from "./form";
import { subscribe, unsubscribe } from "../service-worker";

export default ({ user, posts, subscribed, pushAvailable, reactionTypes, editingId }) => (
  <div>
    <div>
      { user.user }
      { pushAvailable && (
          !subscribed ?
            <button onClick={subscribe}>Enable Notifications</button> :
            <button onClick={unsubscribe}>Disable Notifications</button>
      ) }
      <Form action="/login/logout"><button>Logout</button></Form>
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
          reactionTypes={reactionTypes}
          editable={post.author.user===user.user}
          editing={editingId == post.id}
        />
      ))}
    </div>
  </div>
);
