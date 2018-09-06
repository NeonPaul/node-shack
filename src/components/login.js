import React from 'react';
import Input from './input';
import Form from './form';

export default class Login extends React.Component {
  render () {
    return <div className='Login'>
      <div className='Login__content'>
        <h1 className='Login__title'>Log in</h1>
        <Form action="/login" method="post">
          <Input name='user' autoFocus>Email</Input>
          <Input type='password' name='password'>Password</Input>
          <p className='Login__control'>
            <button>Login</button>
          </p>
        </Form>
      </div>
    </div>
  }
}
