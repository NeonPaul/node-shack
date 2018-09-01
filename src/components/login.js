import React from 'react';

import Input from './input';

export default () =>
  <div className='Login'>
    <div className='Login__content'>
      <h1 className='Login__title'>Log in</h1>
      <form method='post' action='login'>
        <Input name='username' autoFocus>Email</Input>
        <Input type='password' name='password'>Password</Input>
        <p className='Login__control'>
          <button>Login</button>
        </p>
      </form>
    </div>
  </div>
