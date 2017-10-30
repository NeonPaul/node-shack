import React from 'react'
import s from './styles.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

export default withStyles(s)(({ children, ...props }) => React.createElement(props.href ? 'a' : 'button', {...props, className: 'Button ' + (props.className || '')}, children))
