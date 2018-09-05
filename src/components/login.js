import React from 'react';
import collect from 'form-collect';
import fromEntries from 'fromentries';

import Input from './input';

class Login extends React.Component {
  render () {
    return <div className='Login'>
      <div className='Login__content'>
        <h1 className='Login__title'>Log in</h1>
        <form onSubmit={this.submit}>
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

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, password }),
      credentials: 'same-origin'
    });
    e.preventDefault();
  }
}

export default Login;
