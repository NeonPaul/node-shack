import React from 'react'
import marked from 'marked'
import s from './styles.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

const html = __html => ({ __html })

export default withStyles(s)(({ post, editing, editable, edit, newContent, submitEdit }) => <div className='media'>
  <figure className='media-left'>
    <p className='image is-64x64'>
      { post.author && post.author.avatar && <img width='64' src={post.author.avatar} /> }
    </p>
  </figure>
  <div className='media-content'>
    <div className='content'>
      <strong>{ post.author && post.author.user }</strong><br />
      { !editing ? <div className='content box'>
        <div dangerouslySetInnerHTML={html(marked(post.content))} />
        { editable && <button
          onClick={edit}
          className='button is-small'>Edit</button> }
        <reactions postId={post.id}
          reactions={post.reactions} />
      </div>
      : <div>
        <editor content={newContent} />
        <button onClick={submitEdit}
          className='button is-primary'>Save</button>
      </div> }
    </div>
  </div>
</div>)
