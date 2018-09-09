import React from 'react';
import collect from 'form-collect';
import fromEntries from 'fromentries';

import State from '../state';

class Form extends React.Component {
  render () {
    const props = {...this.props};
    delete props.setState;
    return <form  {...props} onSubmit={this.submit.bind(this)} onClick={this.click.bind(this)} />
  }

  click(e) {
    if (e.target.type==="submit") {
      this.submitter = e.target;
    }
    setTimeout(() => this.submitter = null, 0);
  }

  submit(e) {
    const data = fromEntries(collect(e.target, this.submitter || null));
    const method = e.target.method;
    let action = e.target.action;

    const options = {
      method,
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      redirect: 'follow'
    }

    if(method === 'post') {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    } else {
      action += '?' + Object.entries(data).map(entry => entry.map(encodeURIComponent).join('=')).join('&');
    }

    fetch(action, options).then(res => {
      if(res.url !== location.toString()) {
        history.pushState({}, '', res.url);
      }
      return res.headers.get('Content-Type').indexOf('json') > 0 ?
      res.json() :
      res.text().then(m => ({ message: m  }))
    }).then(state => {
      this.props.setState(state);
    }).catch(e => {
      console.log(e);
      this.props.setState({
        message: e.toString()
      })
    });
    e.preventDefault();
  }
}

export default (props) => <State.Consumer>{setState => <Form {...props} setState={setState}/>}</State.Consumer>;
