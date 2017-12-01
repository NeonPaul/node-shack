import React from "react";

export default ({ reactionTypes = [], react = () => {}, reactions = [] }) => (
  <div>
    {reactionTypes.map(type => (
      <button
        key={type}
        className="button is-small"
        onClick={() => react(type)}
      >
        {type.icon} {type.verb}
      </button>
    ))}
    {reactions.map(reaction => (
      <div>
        {reaction.type.icon} {reaction.user.user} {reaction.type.context} this
        post.
      </div>
    ))}
  </div>
);
