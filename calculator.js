keyGenerator(10);

function keyGenerator(number) {
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

// 12 + 7 - 5 * 3 = should yield 42

const topLiner = document.querySelector('.topline');
topLiner.style.visibility = 'hidden';

const displayOutput = document.querySelector('.botline');
const displayOperator = document.getElementById('js-operator');

const inputs = document.querySelectorAll('.keypad');
const operators = document.querySelectorAll('.js-op');

let lastOperator = '';

let codeArray = [];
let inputCapture = [];

let result = 0;
let returnResult = false;

let initalizer = true;

const clearButton = document.querySelector('.js-c');
clearButton.addEventListener('click', () => {

  resetCalculator();

});

let lastType;

function backspaceHandler() {
  if (lastType === 'number') {

    inputCapture.pop();
    displayOutput.textContent = inputCapture.join("");
  } 
}

const backSpace = document.querySelector('.js-b');
backSpace.addEventListener('click', () => {
  if (lastType === 'number') backspaceHandler();
  
});

function numberInputHandler(number) {
  document.querySelector('.line-b').textContent = '';

  inputCapture.push(number);
  displayInput('input', number);
}

decimalCounter = 0;

const decimal = document.getElementById('.');
decimal.addEventListener('click', () => {

  if (decimalCounter === 0) {
    if (inputCapture.length <= 1) {
      numberInputHandler(decimal.id);
    }
  }
  decimalCounter++;
});

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

inputs.forEach( input => {
  
  input.addEventListener( 'click', () => {
    if (input.id !== '.') numberInputHandler(input.id);
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

function operatorHandler(string) {
  string === '=' ? returnResult = true : returnResult = false;
  displayInput('operator', string);
}

operators.forEach( operator => {
  operator.addEventListener( 'click', () => {
    operatorHandler(operator.id);
  });
});

function enableOutput() {
  document.querySelector('.line-a').style.visibility = 'hidden';
  topLiner.style.visibility = 'visible';
}

function resetCalculator() {
  inputCapture = [];
  codeArray = [];
  lastOperator = '';
  displayOutput.textContent = '';

  topLiner.textContent = '';
  document.querySelector('.line-b').textContent = 0;

  lastType = '';
}

let pressCount = 0;

function displayInput(action = 'input', input) {

  if (action === 'input') {

    if (initalizer) {
      topLiner.textContent = '';
      displayOutput.textContent = '';
      initalizer = false;
    }

    if (lastType === 'string') {
      displayOutput.textContent = '';
    }

    // what if user wants to use answer in next sum???
    if (lastOperator === '=') {
      codeArray[1] += input;
    }

    if (lastOperator !== '') {

      displayOutput.textContent += input;

    }
    else {
      displayOutput.textContent += input;
      topLiner.textContent = 0;
    }
    
    lastType = 'number';
  }

  if (action === 'operator') {
    decimalCounter = 0;
    if (lastOperator === '=') {
      lastOperator = input;
      displayOperator.textContent = input;
      topLiner.textContent = codeArray[0];
      topLiner.appendChild(displayOperator); 
    }

    if (lastOperator === '') {
      topLiner.textContent = '';
    }

    enableOutput();

    topLiner.textContent += inputCapture.join("");

    if (lastType === 'number' || initalizer) {
      displayOperator.textContent = input;
      topLiner.appendChild(displayOperator); 

      initalizer = false;
    }

    displayInput('evaluate', null);

    lastOperator = input;

    inputCapture = [];
    
    lastType = 'string';
  }

  if (action === 'evaluate' && input === null) {
    
    if (inputCapture.length > 0) {
      codeArray.push(Number(inputCapture.join("")));
      inputCapture = [];      
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
        topLiner.style.visibility = 'hidden';
      }

      codeArray.splice(0,2);
      codeArray.unshift(result);
    }       
  }
}

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