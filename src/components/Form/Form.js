import React from "react";
import formrouter from "form/dist/form";
import go from "../../history/go";

const form = formrouter((data, method, url) =>
  go(url, { body: data.toJSON(), method: method.toUpperCase() })
);

export default class Form extends React.Component {
  remover = null;

  formInit = el => {
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
