import React from "react";
import Root from "./Root";
import { fetchPosts, updatePost, createPost } from "../../store/posts/actions";

const title = `Root`;

export default {
  path: "/",

  action(ctx, params) {
    return {
      title,
      component: () => <Root edit={ctx.query.edit} />,
      action(method, data, headers) {
        if (method === "POST") {
          const editId = data.get("edit");
          if (editId) {
            return updatePost(editId, data.get("content"), headers);
          } else {
            return createPost(data.get("content"), headers);
          }
        } else {
          return fetchPosts();
        }
      }
    };
  }
};
