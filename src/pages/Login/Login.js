import React from 'react'
import s from './login.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { default as store, SET as set } from '../../store'

class Login extends React.Component {
  constructor (...args){
    super(...args)

    this.state = {
      alert: {},
      method: 'fb'
    }
}

  render() {
    const {alert, method} = this.state;
    const login = (e) => {
      e.preventDefault()
      console.log(store, set)
      store.dispatch(set({ name: 'paul' }))
    }
    const loginFb = () => {}

    const setMethod = method => () => this.setState({ method });

  return (
  <div>
    <h1 className="title">Log in</h1>
    { alert.message && <div className={"notification is-" + alert.type}>
      { alert.message }
    </div> }
    <div className="tabs"><ul>
      <li>Log in with:</li>
      <li className={method==='fb' ? 'is-active': ''}>
        <button onClick={setMethod('fb')}>Facebook</button></li>
      <li className={method==='password' ? 'is-active':''}>
        <button onClick={setMethod('password')}>Password</button></li>
    </ul></div>
    { method==='password' && <form
          onSubmit={e => login(e, { email: e.target.email.value, password: e.target.password.value })}>
      <p className="control">
        <input className="input"
               name="email"
               type="email"
               placeholder="Email"
               autoFocus />
      </p>
      <p className="control">
        <input className="input"
               type="password"
               placeholder="Password"
               name="password" />
      </p>
      <p className="control">
        <button type="submit" className="button is-primary">Login</button>
      </p>
    </form> }
    { method==='fb' && <div className="columns">
      <div className="column is-4 is-offset-4">
        <button onClick={loginFb}>
          <div className="card">
            <div className="card-image">
              <figure className="image">
                <img src="https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png" />
              </figure>
            </div>
            <div className="card-content">Log in with Facebook</div>
          </div>
        </button>
      </div>
    </div> }
</div>
)
}}

export default withStyles(s)(Login)
