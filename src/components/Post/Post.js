import React from 'react'
import marked from 'marked'

const html = __html => ({ __html })

export default ({ post, editing, editable, edit, newContent, submitEdit }) => <div class='media'>
  <figure class='media-left'>
    <p class='image is-64x64'>
      { post.author && post.author.avatar && <img width='64' src={post.author.avatar} /> }
    </p>
  </figure>
  <div class='media-content'>
    <div class='content'>
      <strong>{ post.author && post.author.user }</strong><br />
      { !editing ? <div class='content box'>
        <div dangerouslySetInnerHTML={html(marked(post.content))} />
        { editable && <button
          onClick={edit}
          class='button is-small'>Edit</button> }
        <reactions postId={post.id}
          reactions={post.reactions} />
      </div>
      : <div>
        <editor content={newContent} />
        <button onClick={submitEdit}
          class='button is-primary'>Save</button>
      </div> }
    </div>
  </div>
</div>
