import React from 'react';
// import ReactDOM from 'react-dom';
import Main from './components/main';
import Login from './components/login';
import State from './state'

const post = {
  author: {
    avatar: 'https://via.placeholder.com/100x100',
    user: 'Ross'
  },
  content: 'aaaaaa',
  id: '333',
  reactions: [{
    type: {
      icon: '+1',
      context: 'liked'
    },
    user: {
      user: 'Kate'
    }
  }]
}

class App extends React.Component {
  constructor(props = {}) {
    super();

    this.state = props.state || {};
  }

  render () {
    return <State.Provider value={(v) => this.setState(v)}>
      { this.state.user ? <Main user={this.state.user} posts={[post]} /> : <Login /> }
    </State.Provider>
  }
}

export default App;
