import React from "react";
import { memoize } from "lodash";
import Root from "./Root";
import {
  fetchPosts,
  updatePost,
  createPost,
  reactPost
} from "../../store/posts/actions";
import { fetchReactionTypes } from "../../store/reactions/actions";

const title = `Root`;

const getComp = memoize(edit => () => <Root edit={edit} />);

export default {
  path: "/",

  action(ctx, params) {
    return {
      title,
      component: getComp(ctx.query.edit),
      action(method, data, headers) {
        if (method === "POST") {
          const editId = data.get("edit");
          const reactionId = data.get("react");
          if (editId) {
            return updatePost(editId, data.get("content"), headers);
          } else if (reactionId) {
            return reactPost(data.get("postId"), reactionId, headers);
          } else {
            return createPost(data.get("content"), headers);
          }
        } else {
          return dispatch =>
            Promise.all([
              dispatch(fetchPosts()),
              dispatch(fetchReactionTypes())
            ]);
        }
      }
    };
  }
};
