import React from "react";
import { connect } from "react-redux";
import { getUser } from "../../store";
import { getPosts } from "../../store/posts/selectors";

import s from "./root.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import Post from "../../components/Post/Post";
import Button from "../../components/Button";
import Editor from "../../components/Editor";
import Form from "../../components/Form";

const isEditing = (user, post, editId) =>
  String(post.id) === editId && user.id === post.user_id;

const Root = ({ user, posts, edit }) => (
  <div className="root">
    {user.user}

    <Form method="post">
      <Editor name="content" value="" />
      <Button>Submit</Button>
    </Form>

    <div>
      {posts.map(post => (
        <Post
          post={post}
          key={post.id}
          editing={isEditing(user, post, edit)}
          editable={user.id === post.user_id}
        />
      ))}
    </div>
  </div>
);

const mapStateToProps = state => ({
  user: getUser(state),
  posts: getPosts(state)
});

Root.actions = [];

export default connect(mapStateToProps)(withStyles(s)(Root));
