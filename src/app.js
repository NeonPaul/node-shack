import React from 'react';
import Main from './components/main';
import Login from './components/login';
import State from './state'

class App extends React.Component {
  constructor(props = {}) {
    super();

    this.state = props.state || {};
  }

  render () {
    return <State.Provider value={(v) => this.setState(v)}>
      <div>{ this.state.message || '' }</div>
      {
        this.state.user ?
          <Main user={this.state.user}
                posts={this.state.posts || []}
                subscribed={this.state.subscribed || false}
                pushAvailable={this.state.pushAvailable || false }
                reactionTypes={this.state.reactionTypes || [] }/> :
          <Login />
      }
    </State.Provider>
  }
}

export default App;
