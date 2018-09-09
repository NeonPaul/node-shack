import React from "react";
import marked from "marked";
import Editor from "./editor";
import Reactions from "./reactions";
import Form from "./form";

const html = __html => ({ __html });

export default class Post extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      content: this.props.post.content
    };
  }

  render() {
    const { post, editing, editable, reactionTypes } = this.props;

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
                {editable && <Form><button name="edit" value={post.id}>Edit</button></Form>}
                <Reactions
                  postId={post.id}
                  reactions={post.reactions}
                  reactionTypes={reactionTypes}
                />
              </div>
            ) : (
              <Form method="post" action={`/${post.id}/edit`}>
                <Editor
                  value={this.state.content}
                  onChange={content => this.setState({ content })}
                  name="content"
                />
                <button
                  className="button is-primary"
                  name="edit"
                  value={post.id}
                >
                  Save
                </button>
              </Form>
            )}
          </div>
        </div>
      </div>
    );
  }
}
