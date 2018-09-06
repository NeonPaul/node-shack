import React from 'react';

export default class Editor extends React.Component {
  constructor(...args) {
    super(...args);

    this.mounted = this.mounted.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  async mounted(el) {
    this.el = el;
    const { default: SimpleMDE } = await import("simplemde");

    if (!el) {
      this.unmounted();
      return;
    }

    this.mde = new SimpleMDE({
      element: el,
      autosave: true,
      autofocus: true,
      indentWithTabs: false,
      status: false
    });

    this.mde.codemirror.on("keyup", this.onTextChange);
    this.mde.codemirror.on("change", this.onTextChange);
  }

  onTextChange() {
    if (this.el) {
      this.el.value = this.mde.value();
    }

    if (this.props.onChange) {
      this.props.onChange(this.mde.value());
    }
  }

  unmounted() {
    if (this.mde) {
      this.mde.codemirror.off("keyup", this.onTextChange);
      this.mde.codemirror.off("change", this.onTextChange);
      this.mde = null;
    }
  }

  componentWillReceiveProps({ value }) {
    if (this.mde && this.mde.value() !== value) {
      this.mde.value(value);
    }
  }

  render() {
    const { value, ...props } = this.props;

    return (
      <span>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css"></link>
        <textarea {...props} ref={this.mounted} defaultValue={value} />
      </span>
    );
  }
}
