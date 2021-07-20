import React, { Component } from 'react'

class RawHTML extends Component {
  render () {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.html }} />
    )
  }
};

export default RawHTML
