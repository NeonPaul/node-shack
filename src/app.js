import React from 'react';
// import ReactDOM from 'react-dom';
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
      { this.state.user ? <Main user={this.state.user} posts={this.state.posts || []} /> : <Login /> }
    </State.Provider>
  }
}

export default App;
