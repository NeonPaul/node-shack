import React from "react";
import { connect } from "react-redux";
import { updatePost } from "../../store/posts/actions";
import marked from "marked";
import s from "./styles.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import Editor from "../Editor";

const html = __html => ({ __html });

class Post extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      content: this.props.post.content
    };
  }

  render() {
    const { post, editing, editable, submitEdit } = this.props;

    return (
      <div className="media">
        <figure className="media-left">
          <p className="image is-64x64">
            {post.author &&
              post.author.avatar && <img width="64" src={post.author.avatar} />}
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <strong>{post.author && post.author.user}</strong>
            <br />
            {!editing ? (
              <div className="content box">
                <div dangerouslySetInnerHTML={html(marked(post.content))} />
                {editable && <a href={"?edit=" + post.id}>Edit</a>}
                <reactions postId={post.id} reactions={post.reactions} />
              </div>
            ) : (
              <div>
                <Editor
                  value={this.state.content}
                  onChange={content => this.setState({ content })}
                />
                <button
                  onClick={() => submitEdit(post.id, this.state.content)}
                  className="button is-primary"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  submitEdit: (id, content) => {
    dispatch(updatePost(id, content)).then(() => {
      window.location = "/";
    });
  }
});

export default withStyles(s)(connect(() => ({}), mapDispatchToProps)(Post));
