import React from 'react'
import s from './login.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Button from '../../components/Button'
import cfg from '../../cfg'

const Input = ({ children, ...props }) => <label className='Input'><span className='Input__label'>{children}</span><input className='Input__input' {...props} /></label>

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
      <div className='Login'>
        <div className='Login__content'>
          <h1 className='title'>Log in</h1>
          { alert.message && <div className={'notification is-' + alert.type}>
            { alert.message }
          </div> }
          <Button href={facebook}>Log In With Facebook</Button>
          <p>Or</p>
          <form method='post' action='login'
            onSubmit={e => login(e, { email: e.target.username.value, password: e.target.password.value })}>
            <p className='control'>
              <Input
                name='username'
                autoFocus>Email</Input>
            </p>
            <p className='control'>
              <Input
                type='password'
                name='password'>Password</Input>
            </p>
            <p className='control'>
              <Button>Login</Button>
            </p>
          </form>
        </div>
      </div>
    )
  }
}

export default withStyles(s)(Login)
