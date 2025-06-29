document.addEventListener('DOMContentLoaded', function() {
    const display = document.querySelector('.current-input');
    const historyDisplay = document.querySelector('.history');
    const buttons = document.querySelectorAll('.btn');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;

    // Update display
    function updateDisplay() {
        display.textContent = formatNumber(currentInput);
        historyDisplay.textContent = `${formatNumber(previousInput)} ${operation || ''}`;
    }

    // Format number with commas
    function formatNumber(num) {
        if (num === '') return '';
        if (num.includes('.')) {
            const parts = num.split('.');
            return `${parseFloat(parts[0]).toLocaleString()}.${parts[1]}`;
        }
        return parseFloat(num).toLocaleString();
    }

    // Reset calculator
    function reset() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        resetScreen = false;
        updateDisplay();
    }

    // Append number
    function appendNumber(number) {
        if (currentInput === '0' || resetScreen) {
            currentInput = number;
            resetScreen = false;
        } else {
            currentInput += number;
        }
        updateDisplay();
    }

    // Choose operation
    function chooseOperation(op) {
        if (currentInput === '') return;
        if (previousInput !== '') {
            calculate();
        }
        operation = op;
        previousInput = currentInput;
        resetScreen = true;
        updateDisplay();
    }

    // Calculate
    function calculate() {
        if (operation === null || resetScreen) return;
        
        let result;
        const prev = parseFloat(previousInput.replace(/,/g, ''));
        const current = parseFloat(currentInput.replace(/,/g, ''));
        
        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
            default:
                return;
        }
        
        currentInput = result.toString();
        operation = null;
        resetScreen = true;
        updateDisplay();
    }

    // Add decimal point
    function addDecimal() {
        if (resetScreen) {
            currentInput = '0';
            resetScreen = false;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    // Toggle sign
    function toggleSign() {
        currentInput = (parseFloat(currentInput.replace(/,/g, '')) * -1).toString();
        updateDisplay();
    }

    // Percentage
    function percentage() {
        currentInput = (parseFloat(currentInput.replace(/,/g, '')) / 100).toString();
        updateDisplay();
    }

    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            if (value >= '0' && value <= '9') {
                appendNumber(value);
            } else if (value === '.') {
                addDecimal();
            } else if (value === 'C') {
                reset();
            } else if (value === '±') {
                toggleSign();
            } else if (value === '%') {
                percentage();
            } else if (value === '=') {
                calculate();
            } else {
                chooseOperation(value);
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9') {
            appendNumber(e.key);
        } else if (e.key === '.') {
            addDecimal();
        } else if (e.key === 'Escape') {
            reset();
        } else if (e.key === '+') {
            chooseOperation('+');
        } else if (e.key === '-') {
            chooseOperation('-');
        } else if (e.key === '*') {
            chooseOperation('*');
        } else if (e.key === '/') {
            chooseOperation('/');
        } else if (e.key === '%') {
            percentage();
        } else if (e.key === 'Enter' || e.key === '=') {
            calculate();
        } else if (e.key === 'Backspace') {
            if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            updateDisplay();
        }
    });

    // Initialize
    updateDisplay();
});