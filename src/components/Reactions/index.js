import React from "react";
import Form from "../Form";

export default ({ reactionTypes = [], reactions = [], postId }) => (
  <Form method="post">
    <input type="hidden" name="postId" value={postId} />
    {reactionTypes.map(type => (
      <button
        key={type.id}
        className="button is-small"
        name="react"
        value={type.id}
      >
        {type.icon} {type.verb}
      </button>
    ))}
    {reactions.map(reaction => (
      <div key={reaction.user_id}>
        {reaction.type.icon} {reaction.user.user} {reaction.type.context} this
        post.
      </div>
    ))}
  </Form>
);
