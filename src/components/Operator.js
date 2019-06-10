import React from 'react';

const OPERATIONS = {
  add: {
    symbol: "+",
    opFunction: function(first, second) {
      return first + second;
    }
  },

  subtract: {
    symbol: "-",
    opFunction: function(first, second) {
      return first - second;
    }
  },

  multiply: {
    symbol: "*",
    opFunction: function(first, second) {
      return first * second;
    }
  },

  divide: {
    symbol: "/",
    opFunction: function(first, second) {
      return first / second;
    }
  }
};

class Operator extends React.Component {
  constructor(props) {
    super(props);
    this.op = OPERATIONS[this.props.op];
  }

  componentDidMount() {
    this.props.addKeyDownListener(this.op.symbol, this.handleKeyDown);
  }

  componentWillUnmount() {
    this.props.removeKeyDownListener(this.op.symbol, this.handleKeyDown);
  }

  handleKeyDown = () => {
    this.props.operatorClick(this.op.opFunction);
  };

  handleClick = () => {
    this.props.operatorClick(this.op.opFunction);
  };

  render() {
    return (
      <div id={this.props.id} onClick={this.handleClick} className="button">
        {this.op.symbol}
      </div>
    );
  }
}

export default Operator;