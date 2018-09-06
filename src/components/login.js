import React from 'react';
import collect from 'form-collect';
import fromEntries from 'fromentries';

import Input from './input';
import State from '../state';

class Login extends React.Component {
  render () {
    return <div className='Login'>
      <div className='Login__content'>
        <h1 className='Login__title'>Log in</h1>
        <form onSubmit={this.submit.bind(this)} action="/login" method="post">
          <Input name='user' autoFocus>Email</Input>
          <Input type='password' name='password'>Password</Input>
          <p className='Login__control'>
            <button>Login</button>
          </p>
        </form>
      </div>
    </div>
  }

  submit(e) {
    const { user, password } = fromEntries(collect(e.target));

    fetch(e.target.action, {
      method: e.target.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ user, password }),
      credentials: 'same-origin'
    }).then(res => res.json()).then(state => {
      this.props.setState(state);
    }).catch(e => {
      console.log(e);
    });
    e.preventDefault();
  }
}

export default () => <State.Consumer>{setState => <Login setState={setState}/>}</State.Consumer>;
