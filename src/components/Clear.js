import React from 'react';

class Clear extends React.Component {
  componentDidMount() {
    this.props.addKeyDownListener('Escape', this.handleKeyDown);
  }

  componentWillUnmount() {
    this.props.removeKeyDownListener('Escape', this.handleKeyDown);
  }

  handleKeyDown = () => {
    this.props.clearClick();
  };

  handleClick = () => {
    this.props.clearClick();
  };

  render() {
    return (
      <div id={this.props.id} onClick={this.handleClick} className="button">
        AC
      </div>
    );
  }
}

export default Clear;