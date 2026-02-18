// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Initialize theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateToggleIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const targetTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateToggleIcon(targetTheme);
});

function updateToggleIcon(theme) {
    themeToggle.innerText = theme === 'light' ? '🌙' : '☀️';
}

// Lotto Drawing Logic
document.getElementById('draw-btn').addEventListener('click', function() {
    const container = document.getElementById('lotto-container');
    const button = this;

    container.innerHTML = '';
    button.disabled = true;
    button.innerText = '추첨 중...';

    const numbers = [];
    while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    numbers.sort((a, b) => a - b);

    let index = 0;
    const interval = setInterval(() => {
        if (index < numbers.length) {
            const num = numbers[index];
            const ball = document.createElement('div');
            ball.className = `ball ${getRangeClass(num)}`;
            ball.innerText = num;
            container.appendChild(ball);
            index++;
        } else {
            clearInterval(interval);
            button.disabled = false;
            button.innerText = '번호 다시 추첨하기';
        }
    }, 400);
});

function getRangeClass(num) {
    if (num <= 10) return 'range-10';
    if (num <= 20) return 'range-20';
    if (num <= 30) return 'range-30';
    if (num <= 40) return 'range-40';
    return 'range-max';
}
