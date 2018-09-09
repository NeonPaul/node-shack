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

    fetch(e.target.action, {
      method: e.target.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'same-origin',
      redirect: 'follow'
    }).then(res =>
      res.headers.get('Content-Type').indexOf('json') > 0 ?
      res.json() :
      res.text().then(m => ({ message: m  }))
    ).then(state => {
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
