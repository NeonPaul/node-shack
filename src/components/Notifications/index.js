import React from 'react'
import s from './styles.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

export default withStyles(s)(({ active, ...props }) =>
  <button className='Notifications' {...props}>
    { active ? 'Notifications Enabled 🔔' : 'Notifications Disabled 🔕' }
  </button>
)
