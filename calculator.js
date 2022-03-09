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