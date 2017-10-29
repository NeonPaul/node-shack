import React from 'react'
import s from './login.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Button from '../../components/Button'
import cfg from '../../cfg'

// import { default as store, SET as set } from '../../store'

const facebook = `https://www.facebook.com/v2.10/dialog/oauth?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.ROOT_URL}${cfg.fbAuthPath}&scope=email`

class Login extends React.Component {
  constructor (...args) {
    super(...args)

    this.state = {
      alert: {}
    }
  }

  render () {
    const {alert} = this.state
    const login = (e) => {
      // return // Just do a post for now
      // e.preventDefault()
      // store.dispatch(set({ name: 'paul' }))
    }

    // const setMethod = method => () => this.setState({ method });

    return (
      <div>
        <h1 className='title'>Log in</h1>
        { alert.message && <div className={'notification is-' + alert.type}>
          { alert.message }
        </div> }
        <div>
          <Button href={facebook}>Log In With Facebook</Button>
        </div>
        <form method='post' action='login'
          onSubmit={e => login(e, { email: e.target.username.value, password: e.target.password.value })}>
          <p className='control'>
            <input className='input'
              name='username'
              placeholder='Username'
              autoFocus />
          </p>
          <p className='control'>
            <input className='input'
              type='password'
              placeholder='Password'
              name='password' />
          </p>
          <p className='control'>
            <button type='submit' className='button is-primary'>Login</button>
          </p>
        </form>
      </div>
    )
  }
}

export default withStyles(s)(Login)
