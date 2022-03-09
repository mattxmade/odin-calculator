// generate keypads
generateKeypads(10);

function generateKeypads(number) {
  const grid = document.getElementById('grid');
  

  for(let i = -1; i < number; i++) {

    const keyPad = document.createElement('div');
    keyPad.classList.add('keypad');

    const keypadNumber = document.createElement('p');

    const keyShader = document.createElement('div');
    keyShader.classList.add('keypad-shader');

    switch(i) {
      case -1:
        keyPad.id = 0;
        keyPad.classList.add(`keypad-${0}`);
        keyShader.classList.add(`shader-${0}`);
        keypadNumber.textContent = 0;
        break;

      case 0:
        keyPad.id = '.';
        keyPad.classList.add(`keypad-decimal`);
        keypadNumber.textContent = '.'; 
        break;

      default:
        keyPad.id = i;
        keyPad.classList.add(`keypad-${i}`);
        keypadNumber.textContent = i;   
        break;           
    }

    keyPad.appendChild(keypadNumber)
    keyPad.appendChild(keyShader);
    grid.appendChild(keyPad);
  }
}

const topLine = document.querySelector('.topline');
topLine.style.visibility = 'hidden';

const displayOutput = document.querySelector('.botline');
const displayOperator = document.getElementById('js-operator');

const inputs = document.querySelectorAll('.keypad');
const operators = document.querySelectorAll('.js-op');

const codeArray = [];
const inputCapture = [];

let result = 0;
let initalise = true;
let returnResult = false;

let lastAction;
let lastOperator = 'none';

// clear calculator
const clearButton = document.querySelector('.js-c');

clearButton.addEventListener('click', () => {
  resetCalculator();
});

// backspace
const backSpace = document.querySelector('.js-b');

backSpace.addEventListener('click', () => {

  if (lastAction === 'number') backspaceHandler();
  
});

function backspaceHandler() {
  inputCapture.pop();
  displayOutput.textContent = inputCapture.join("");
}

// decimal key
let decimalCounter = 0;

const decimal = document.getElementById('.');
decimal.addEventListener('click', () => {

  if (decimalCounter === 0) {
    if (inputCapture.length <= 1) {
      numberInputHandler(decimal.id);
    }
  }
  decimalCounter++;
});

let zeroCounter = 0;

const zeroKey = document.getElementById('0');
zeroKey.addEventListener('click', () => {

  if (inputCapture[0] !== '0') {
    numberInputHandler(zeroKey.id);
  }
  if (inputCapture[0] === '0' && inputCapture[1] === '.') {
    numberInputHandler(zeroKey.id);
  }
});

// number keypads
inputs.forEach( input => {
  
  input.addEventListener( 'click', () => {
    console.log(input.id);
    if (input.id !== '.' && input.id !== '0') {
      numberInputHandler(input.id);
    }
      
  });

  let lastStyle = input.style.background;

  // modifiy key style when pressed
  const keypadDown = input.cloneNode(true);
  keypadStyleModifier(input, keypadDown);

  input.addEventListener( 'mousedown', () => {
    input.style.background = 'black';
    keypadDown.style.visibility = 'visible';
  });

  input.addEventListener( 'mouseup', () => {
    keypadDown.style.visibility = 'hidden';
    input.style.background = lastStyle;
  });

});

// handle number input
function numberInputHandler(number) {
  document.querySelector('.line-b').textContent = '';

  if (inputCapture.length < 11) {
    inputCapture.push(number);
    displayInput('input', number);
  }

}

// style modifier
function keypadStyleModifier(element, modifier) {
  
  modifier.style.position = 'absolute';
  modifier.style.zIndex = 10;

  Number(element.id) === 0 
  ? modifier.style.width = '99%'
  : modifier.style.width = '9rem';

  modifier.style.height = '9rem';
  modifier.style.visibility = 'hidden';

  element.appendChild(modifier);
}

// operator keypads
function operatorHandler(string) {
  string === '=' ? returnResult = true : returnResult = false;
  displayInput('operator', string);
}

operators.forEach( operator => {
  operator.addEventListener( 'click', () => {
    operatorHandler(operator.id);
  });
});

// display to calculator screen
function displayInput(action = 'input', input) {

  if (action === 'input') {

    if (initalise) {
      topLine.textContent = '';
      displayOutput.textContent = '';
      initalise = false;
    }

    if (lastAction === 'operator') {
      displayOutput.textContent = '';
    }

    switch(lastOperator) {
      case '=':
        codeArray[1] += input;
        break;

      case 'none':
        topLine.textContent = 0;
        break;
    }    

    displayOutput.textContent += input;
    lastAction = 'number';

    scaleFontSize();
  }

  if (action === 'operator') {
    
    switch(lastOperator) {

      case '=':
        lastOperator = input;
        displayOperator.textContent = input;

        topLine.textContent = codeArray[0];
        topLine.appendChild(displayOperator);
        break;

      case 'none':
        topLine.textContent = '';
        break;
    }

    topLine.textContent += inputCapture.join("");

    if (lastAction === 'number' || initalise) {
      displayOperator.textContent = input;
      topLine.appendChild(displayOperator); 

      initalise = false;
    }

    enableOutput();
    calculateResult();

    zeroCounter = 0
    decimalCounter = 0;
    lastOperator = input;
    lastAction = 'operator';
  }
}

function scaleFontSize() {
  const inputLength = displayOutput.textContent.length;

  if (inputLength > 9) {

    const maxWidth = removeUnits(window.getComputedStyle(displayOutput).width);
    const fontAllocation = (maxWidth / inputLength) + 18;
    
    displayOutput.style.fontSize = `${fontAllocation}px`;
  }

}

function removeUnits(string) {
  const number = Number(string.slice(0, string.length-2))
  return number;
}

// display ongoing expression
function enableOutput() {
  document.querySelector('.line-a').style.visibility = 'hidden';
  topLine.style.visibility = 'visible';
}

function calculateResult() {

  if (inputCapture.length > 0) {
    codeArray.push(Number(inputCapture.join("")));
    inputCapture.length = 0;      
  }

  if (codeArray.length > 1) {

    result = operate(lastOperator, codeArray[0], codeArray[1]);

    console.log(
      `Calculated! 
      ${codeArray[0]} ${lastOperator} ${codeArray[1]} 
      = ${result}`);

     displayOutput.textContent = result;

    if (returnResult) {
      displayOutput.textContent = result;
      topLine.style.visibility = 'hidden';
    }

    codeArray.splice(0,2);
    codeArray.unshift(result);
  }  
}

function resetCalculator() {
  codeArray.length = 0;
  lastAction = 'none';
  inputCapture.length = 0;
  lastOperator = 'none';

  topLine.textContent = '';
  displayOutput.textContent = 0;
  displayOutput.style.fontSize = '60px'
  document.querySelector('.line-b').textContent = 0;
}

// math functions
function add(numX = 0, numY = 0) {
  return numX + numY;
}
function sub(numX = 0, numY = 0) {
  return numX - numY ;
}
function mul(numX = 0, numY = 0) {
  return numX * numY;
}
function div(numX = 0, numY = 0) {
  return numX / numY;
}

// calculate
function operate(operator, numX = 0, numY = 0) {
  let sumUp = 0;

  switch(operator) {
    case '+':
      sumUp = add(numX, numY);
      break;
    case '-':
      sumUp = sub(numX, numY);
      break;
    case '*':
      sumUp = mul(numX, numY);
      break;
    case '/':
      sumUp = div(numX, numY);
      break;  
  }
  return sumUp;
}

// keyboard listeners
const keyboardInput = document.querySelector('body');
keyboardInput.addEventListener('keydown', (e) => {

  if (isNaN(e.key)) {
    console.log(e.key);
    switch(e.key) {

      case '+':
        operatorHandler(e.key);
        break;
      case '-':
        operatorHandler(e.key);
        break;
      case '*':
        operatorHandler(e.key);
        break;
      case '/':
        operatorHandler(e.key);
        break;
      case 'Backspace':
        backspaceHandler();
        break;
      case 'Delete':
        resetCalculator();
        break;
      case 'Enter':
        operatorHandler('=');
        break;
      case '.':
        numberInputHandler(e.key);
        break;
    }
  }
  else {
   numberInputHandler(e.key);
  }
});

