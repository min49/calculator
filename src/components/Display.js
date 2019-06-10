import React from 'react';

class Display extends React.Component {
  render() {
    return (
      <div id='display-wrapper'>
        <div id={this.props.id}>{this.props.value}</div>
        <div id='comma-display'>{this.props.commas}</div>
      </div>);
  }
}

export default Display;