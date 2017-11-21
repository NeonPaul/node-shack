import React from "react";
import Root from "./Root";
import { fetchPosts } from "../../store/posts/actions";

const title = `Root`;

export default {
  path: "/",

  action(ctx, params) {
    return {
      title,
      component: () => <Root edit={ctx.query.edit} />,
      action(method, data) {
        return fetchPosts();
      }
    };
  }
};
