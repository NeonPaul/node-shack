import React from 'react';

export default ({ children, ...props }) =>
  <label className='Input'>
    <span className='Input__label'>{children}</span>
    <input className='Input__input' {...props} />
  </label>
