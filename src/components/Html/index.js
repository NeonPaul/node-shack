import PropTypes from 'prop-types'
import React from 'react'
import s from './html.css';

class Html extends React.Component {
  render () {
    const { title, description, styles, scripts, children, state, user } = this.props
    return (
      <html className='no-js' lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />
          <title>{title}</title>
          <meta name='description' content={description} />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='apple-touch-icon' href='apple-touch-icon.png' />
          <style dangerouslySetInnerHTML={{ __html: s._getCss() }} />
          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
          />

        )}
        <script dangerouslySetInnerHTML={{ __html: `
          window.process = {
            env: JSON.parse(${JSON.stringify(JSON.stringify({
              ROOT_URL: process.env.ROOT_URL,
              FB_APP_ID: process.env.FB_APP_ID
            }))})
          }`}} />
        </head>
        <body>
          <div id='root' className='app-wrapper'
            dangerouslySetInnerHTML={{ __html: children }}
      />
        <script dangerouslySetInnerHTML={{ __html: `
          window.initialState = ${JSON.stringify(state || '')}
        ` }} />
        { scripts.map(script => <script key={script} src={script} />) }
          </body>
      </html>
    )
  }
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  styles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    cssText: PropTypes.string.isRequired
  }).isRequired),
  scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
  children: PropTypes.string.isRequired
}

Html.defaultProps = {
  styles: [],
  scripts: []
}

export default Html
