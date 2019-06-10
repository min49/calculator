import React from 'react';

class Equal extends React.Component {
  componentDidMount() {
    this.props.addKeyDownListener('Enter', this.handleKeyDown);
  }

  componentWillUnmount() {
    this.props.removeKeyDownListener('Enter', this.handleKeyDown);
  }

  handleKeyDown = () => {
    this.props.equalClick();
  };

  handleClick = () => {
    this.props.equalClick();
  };

  render() {
    return (
      <div id={this.props.id} onClick={this.handleClick} className="button">
        =
      </div>
    );
  }
}

export default Equal;