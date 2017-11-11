import React from 'react'
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'

export class Editor extends React.Component {
  constructor (...args) {
    super(...args)

    this.mounted = this.mounted.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
  }

  mounted (el) {
    if (!el) {
      this.unmounted()
    }

    this.mde = new SimpleMDE({
      element: el,
      autosave: true,
      autofocus: true,
      indentWithTabs: false,
      status: false
    })

    this.mde.codemirror.on('change', this.onTextChange)
  }

  onTextChange () {
    if (this.props.onChange) {
      this.props.onChange(this.mde.value())
    }
  }

  unmounted () {
    this.mde.codemirror.off('change', this.onTextChange)
    this.mde = null
  }

  componentWillReceiveProps ({ value }) {
    if (this.mde && this.mde.value() !== value) {
      this.mde.value(value)
    }
  }

  render () {
    const { value } = this.props

    return <span>
      <textarea ref={this.mounted}>{{value}}</textarea>
    </span>
  }
}
