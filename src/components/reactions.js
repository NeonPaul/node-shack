import React from "react";
import Form from './form';

export default ({ reactionTypes = [], reactions = [], postId }) => (
  <Form method="post" action={`/${postId}/react`}>
    {reactionTypes.map(type => (
      <button
        key={type.id}
        className="button is-small"
        name="reactionType"
        value={type.id}
      >
        {type.icon} {type.verb}
      </button>
    ))}
    {reactions.map(reaction => (
      <div key={reaction.user}>
        {reaction.icon} {reaction.user} {reaction.context} this
        post.
      </div>
    ))}
  </Form>
);
