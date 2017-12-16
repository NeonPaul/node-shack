import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import queryString from "query-string";

import App from "./App";
import history from "./history";
import router from "./router";
import createStore from "./store";
import { getUser } from "./store";
import FormData from "querybucket/dist/form-data";

const store = createStore();

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss());
    return () => {
      removeCss.forEach(f => f());
    };
  }
};

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Route: props.route
    };
  }

  setRoute(Route) {
    if (Route !== this.state.Route) {
      this.setState({ Route });
    }
  }

  render() {
    const Route = this.state.Route;

    return (
      <Provider store={store}>
        <App context={context}>
          <Route />
        </App>
      </Provider>
    );
  }
}

const container = document.getElementById("root");

async function getRoute(location, action) {
  const state = location.state || {};

  try {
    const route = await router.resolve({
      path: location.pathname,
      query: queryString.parse(location.search),
      user: getUser(store.getState())
    });

    if (route.redirect) {
      history.replace(route.redirect);
      return;
    }

    const Route = route.component;

    const action = route.action || Route.action;

    if (action) {
      const formData = new FormData(state.body);
      const method = state.method;
      const redirect = await store.dispatch(action(method, formData, {}));

      if (method === "POST") {
        const redirectUrl =
          typeof redirect === "string"
            ? redirect
            : location.pathname + location.search;
        history.replace(redirectUrl);
        return;
      }
    }

    return Route;
  } catch (error) {
    console.error(error);
  }
}

getRoute(history.location).then(Route => {
  const page = ReactDOM.render(<Page route={Route} />, container);

  const onLocationChange = async (location, action) => {
    const Route = await getRoute(location, action);

    if (Route) {
      page.setRoute(Route);
    }
  };

  let user = getUser(store.getState());

  history.listen(onLocationChange);
  store.subscribe(() => {
    const nextUser = getUser(store.getState());
    if (nextUser !== user) {
      user = nextUser;
      onLocationChange(history.location, history.action);
    }
  });
});
