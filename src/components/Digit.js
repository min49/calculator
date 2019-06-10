import React from 'react';

class Digit extends React.Component {
  constructor(props) {
    super(props);
    this.digit = this.props.digit;
  }

  componentDidMount() {
    this.props.addKeyDownListener(this.digit, this.handleKeyDown);
  }

  componentWillUnmount() {
    this.props.removeKeyDownListener(this.digit, this.handleKeyDown);
  }

  handleKeyDown = () => {
    this.props.digitClick(this.digit);
  };

  handleClick = () => {
    this.props.digitClick(this.digit);
  };

  render() {
    return (
      <div
        id={this.props.id}
        digit={this.digit}
        onClick={this.handleClick}
        className="button"
      >
        {this.digit}
      </div>
    );
  }
}

export default Digit;