const display = document.getElementById('display');
const formulaDisplay = document.getElementById('formula');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// 화면 업데이트
function updateDisplay() {
    display.value = currentInput;
}

// 숫자 입력
function appendNumber(num) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

// 소수점 입력
function appendDot() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

// 연산자 설정 (+, -, *, /)
function setOperator(op) {
    if (operator && !shouldResetDisplay) {
        calculateInternal();
    }
    previousInput = currentInput;
    operator = op;
    const opSymbol = op === '*' ? '×' : op === '/' ? '÷' : op;
    formulaDisplay.textContent = `${previousInput} ${opSymbol}`;
    shouldResetDisplay = true;
}

// 내부 계산 로직
function calculateInternal() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': 
            if (current === 0) {
                currentInput = '0으로 나눌 수 없습니다';
                updateDisplay();
                clearAll();
                return;
            }
            result = prev / current; 
            break;
        default: return;
    }

    // 소수점 10자리 제한으로 부동소수점 오차 방지 및 숫자로 변환해 뒤의 0 제거
    currentInput = String(Number(result.toFixed(10)));
    previousInput = currentInput;
}

// 결과 출력 (=)
function calculate() {
    if (!operator) return;
    calculateInternal();
    formulaDisplay.textContent = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// 현재 입력만 지우기 (CE)
function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

// 전체 초기화 (C)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    formulaDisplay.textContent = '';
    updateDisplay();
}

// 지우기 (⌫)
function deleteLast() {
    if (shouldResetDisplay) return;
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// 부호 반전 (+/-)
function toggleSign() {
    currentInput = String(parseFloat(currentInput) * -1);
    updateDisplay();
}

// 역수 (1/x)
function fraction() {
    const val = parseFloat(currentInput);
    if (val === 0) {
        currentInput = '0으로 나눌 수 없습니다';
    } else {
        currentInput = String(Number((1 / val).toFixed(10)));
    }
    shouldResetDisplay = true;
    updateDisplay();
}

// 제곱 (x²)
function square() {
    const val = parseFloat(currentInput);
    currentInput = String(Number((val * val).toFixed(10)));
    shouldResetDisplay = true;
    updateDisplay();
}

// 제곱근 (√x)
function sqrt() {
    const val = parseFloat(currentInput);
    if (val < 0) {
        currentInput = '잘못된 입력입니다';
    } else {
        currentInput = String(Number(Math.sqrt(val).toFixed(10)));
    }
    shouldResetDisplay = true;
    updateDisplay();
}
