import React from "react";
import go from "../../history/go";

export default class Form extends React.Component {
  remover = null;

  formInit = el => {
    const form = require("isomorphic-form/dist/form")((data, method, url) =>
      go(url, { body: data.toJSON(), method: method.toUpperCase() })
    )
    if (this.remover) {
      this.remover();
      this.remover = null;
    }

    if (el) {
      this.remover = form(el);
    }
  };

  render() {
    const { children, ...props } = this.props;
    return (
      <form ref={this.formInit} {...props}>
        {children}
      </form>
    );
  }
}
