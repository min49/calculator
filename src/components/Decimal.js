import React from 'react';

class Decimal extends React.Component {
  constructor(props) {
    super(props);
    this.decimal = '.';
  }

  componentDidMount() {
    this.props.addKeyDownListener(this.decimal, this.handleKeyDown);
  }

  componentWillUnmount() {
    this.props.removeKeyDownListener(this.decimal, this.handleKeyDown);
  }

  handleClick = () => {
    this.props.decimalClick();
  };

  handleKeyDown = () => {
    this.props.decimalClick();
  };

  render() {
    return (
      <div id={this.props.id} onClick={this.handleClick} className="button">
        {this.decimal}
      </div>
    );
  }
}

export default Decimal;