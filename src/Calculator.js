import React from 'react';
import './Calculator.css';
import {Clear, Decimal, Digit, Display, Equal, Operator} from './components';
import KeyDownListenerManager from './util/KeyDownListenerManager';


class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = Calculator.initialState();
    this.keyDownListenerManager = new KeyDownListenerManager();
  }

  static get MAX_DIGITS() { return 10; }

  componentDidMount() {
    document.addEventListener('keydown', this.keyDownListenerManager.handle);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownListenerManager.handle);
  }

  digitClick = digit => {
    this.setState(state => {
      if (state.isInErrorState) return state;

      let value = (state.resetDisplay || state.display === "0")
        ? "" : state.display;
      if (Calculator.strBelowMaxDigits(value))
        value += digit;

      return {
        display: value,
        commas: Calculator.generateCommas(value),
        resetDisplay: false
      };
    });
  };

  decimalClick = () => {
    this.setState(state => {
      if (state.isInErrorState) return state;

      let value = state.resetDisplay ? "0" : state.display;
      if (Calculator.strBelowMaxDigits(value) && !/\./.test(value))
        value += ".";

      return {
        display: value,
        commas: Calculator.generateCommas(value),
        resetDisplay: false
      };
    });
  };

  operatorClick = opFunction => {
    this.setState(state => {
      if (state.isInErrorState) return state;

      if (
        state.isFirstOperator ||
        Calculator.displayInputHasNotBeenChanged(state)
      ) {
        return createFirstOperatorChange(state);
      } else {
        return calculateLastOperator_AndCreateCurrentOperatorChange(state);
      }
    });

    function createFirstOperatorChange(state) {
      return {
        operator: opFunction,
        firstOperand: Calculator.displayInputHasBeenChanged(state)
          ? parseFloat(state.display)
          : state.firstOperand,
        secondOperand: null,
        isFirstOperator: false,
        resetDisplay: true,
        operandToChange: "second"
      };
    }

    function calculateLastOperator_AndCreateCurrentOperatorChange(state) {
      let secondOperand = parseFloat(state.display);
      let value = state.operator(state.firstOperand, secondOperand);

      if (Calculator.numberExceedsMaxDigits(value))
        return Calculator.errorState();
      else {
        let displayValue = Calculator.roundDisplayValueDecimalsToMaxDigits(value);
        return {
          display: displayValue,
          commas: Calculator.generateCommas(displayValue),
          operator: opFunction,
          firstOperand: value,
          secondOperand: null,
          resetDisplay: true,
          operandToChange: "second"
        };
      }
    }
  };

  equalClick = () => {
    this.setState(state => {
      if (state.isInErrorState) return state;

      if (state.operator === null) // pressing = right after digits (e.g. 12 =)
        return noOpEqualStateChange();
      else
        return calculateWithOperator(state);
    });

    function noOpEqualStateChange() {
      return {
        resetDisplay: true,
        operandToChange: "first"
      };
    }

    function calculateWithOperator(state) {
      let firstOperand = getFirstOperand(state);
      let secondOperand = getSecondOperand(state);
      let newValue = state.operator(firstOperand, secondOperand);

      if (Calculator.numberExceedsMaxDigits(newValue))
        return Calculator.errorState();
      else
        return maxDigitsCompliantCalculatedState(newValue, secondOperand);
    }

    function getFirstOperand(state) {
      if (firstOperandIsExplicitlyInputToDisplay(state))
        return parseFloat(state.display);
      else
        return state.firstOperand;
    }

    function firstOperandIsExplicitlyInputToDisplay(state) {
      return (state.operandToChange === "first" &&
        Calculator.displayInputHasBeenChanged(state));
    }

    function getSecondOperand(state) {
      if (state.secondOperand === null) // 3 + = -> 6
        return parseFloat(state.display);
      else
        return state.secondOperand;
    }

    function maxDigitsCompliantCalculatedState(newValue, secondOperand) {
      let displayValue = Calculator.roundDisplayValueDecimalsToMaxDigits(newValue);
      return {
        display: displayValue,
        commas: Calculator.generateCommas(displayValue),
        firstOperand: newValue,
        secondOperand: secondOperand,
        isFirstOperator: true,
        resetDisplay: true,
        operandToChange: "first"
      };
    }
  };

  clearClick = () => {
    this.setState(Calculator.initialState());
  };

  static initialState() {
    return {
      display: "0",
      commas: "",
      operator: null,
      firstOperand: 0,
      secondOperand: null,
      resetDisplay: false,
      isFirstOperator: true, // 1 + 2 + -> 3 +
      operandToChange: "first",
      isInErrorState: false
    };
  }

  static errorState() {
    return {
      display: 'E',
      commas: '',
      isInErrorState: true
    };
  }

  static displayInputHasBeenChanged(state) {
    return !state.resetDisplay;
  }

  static displayInputHasNotBeenChanged(state) {
    return state.resetDisplay;
  }

  static numberExceedsMaxDigits(value) {
    return (value >= Math.pow(10, Calculator.MAX_DIGITS));
  }

  static strBelowMaxDigits(valueStr) {
    return valueStr.length < Calculator.MAX_DIGITS;
  }

  static roundDisplayValueDecimalsToMaxDigits(value) {
    let displayValue = value.toString();
    let decimalIndex = displayValue.indexOf('.');
    if (decimalIndex > -1) {
      let tenPower = (decimalIndex >= Calculator.MAX_DIGITS)
        ? Calculator.MAX_DIGITS - (decimalIndex) // decimal at the end of max_digit
        : Calculator.MAX_DIGITS - (decimalIndex + 1);
      let roundingMultiplier = Math.pow(10, tenPower);
      displayValue = Math.round(value * roundingMultiplier) / roundingMultiplier;
      displayValue = displayValue.toString();
    }
    return displayValue;
  }

  static generateCommas(value) {
    let decimalIndex = value.indexOf('.');
    if (decimalIndex === -1) decimalIndex = value.length;

    let commas = '';
    let start = value[0] === '-' ? 4 : 3; // negative number
    for (let i = start; i < decimalIndex; i += 3) { // digits before decimal
      commas += ',     ';
    }
    for (let j = decimalIndex; j < value.length; j++) { // digits after decimal
      commas += '  ';
    }

    return commas;
  }

  render() {
    return (
      <div id='calculator'>
        <Display id="display" value={this.state.display} commas={this.state.commas} />
        <Clear id="clear" clearClick={this.clearClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="seven" digit="7" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="eight" digit="8" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="nine" digit="9" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="four" digit="4" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="five" digit="5" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="six" digit="6" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="one" digit="1" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="two" digit="2" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="three" digit="3" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Digit id="zero" digit="0" digitClick={this.digitClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Decimal id="decimal" decimalClick={this.decimalClick}
                 addKeyDownListener={this.keyDownListenerManager.add}
                 removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Operator id="add" op="add" operatorClick={this.operatorClick}
                  addKeyDownListener={this.keyDownListenerManager.add}
                  removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Operator id="subtract" op="subtract" operatorClick={this.operatorClick}
                  addKeyDownListener={this.keyDownListenerManager.add}
                  removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Operator id="multiply" op="multiply" operatorClick={this.operatorClick}
                  addKeyDownListener={this.keyDownListenerManager.add}
                  removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Operator id="divide" op="divide" operatorClick={this.operatorClick}
                  addKeyDownListener={this.keyDownListenerManager.add}
                  removeKeyDownListener={this.keyDownListenerManager.remove} />
        <Equal id="equals" equalClick={this.equalClick}
               addKeyDownListener={this.keyDownListenerManager.add}
               removeKeyDownListener={this.keyDownListenerManager.remove} />
      </div>
    );
  }
}


export default Calculator;
