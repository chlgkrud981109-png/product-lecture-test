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

// Game Personality Test Logic
const questions = [
    {
        question: "어떤 종류의 긴장감을 즐기시나요?",
        options: [
            { text: "빠른 반응이 필요한 긴박한 전투", score: { action: 2, strategy: 0 } },
            { text: "차분하게 생각하고 결정하는 심리전", score: { action: 0, strategy: 2 } }
        ]
    },
    {
        question: "게임에서 가장 중요하게 생각하는 가치는?",
        options: [
            { text: "화려한 액션과 타격감", score: { action: 2, story: 0 } },
            { text: "몰입감 넘치는 스토리와 세계관", score: { action: 0, story: 2 } }
        ]
    },
    {
        question: "어떤 플레이 방식을 선호하시나요?",
        options: [
            { text: "다른 유저와의 치열한 경쟁", score: { competitive: 2, relaxed: 0 } },
            { text: "혼자 혹은 친구와 즐기는 여유로운 플레이", score: { competitive: 0, relaxed: 2 } }
        ]
    }
];

const results = [
    {
        type: "competitive-action",
        title: "승부욕 넘치는 스트라이커",
        description: "당신은 빠른 판단력과 경쟁을 즐기는 타입입니다! 짜릿한 승리를 맛볼 수 있는 게임을 추천합니다.",
        games: ["리그 오브 레전드", "오버워치 2", "발로란트"]
    },
    {
        type: "relaxed-action",
        title: "자유로운 모험가",
        description: "화려한 액션을 좋아하지만, 타인과의 경쟁보다는 자신만의 속도로 즐기는 것을 선호하시네요.",
        games: ["엘든 링", "몬스터 헌터", "데빌 메이 크라이"]
    },
    {
        type: "competitive-strategy",
        title: "냉철한 전략가",
        description: "상대방의 수를 읽고 치밀한 계획으로 승리하는 것에서 쾌감을 느끼는 타입입니다.",
        games: ["스타크래프트", "TFT (전략적 팀 전투)", "하스스톤"]
    },
    {
        type: "relaxed-story",
        title: "감성적인 스토리텔러",
        description: "게임의 분위기와 이야기를 중요하게 생각하며, 여유롭게 세계관에 몰입하는 것을 즐기시네요.",
        games: ["모동숲", "스타듀 밸리", "디트로이트: 비컴 휴먼"]
    }
];

let currentQuestionIndex = 0;
let scores = { action: 0, strategy: 0, story: 0, competitive: 0, relaxed: 0 };

const testContainer = document.getElementById('test-container');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    if (startBtn.innerText === '테스트 시작하기' || startBtn.innerText === '다시 테스트하기') {
        startTest();
    }
});

function startTest() {
    currentQuestionIndex = 0;
    scores = { action: 0, strategy: 0, story: 0, competitive: 0, relaxed: 0 };
    showQuestion();
    startBtn.style.display = 'none';
}

function showQuestion() {
    const q = questions[currentQuestionIndex];
    testContainer.innerHTML = `
        <div class="question-box">
            <div class="question-number">Q${currentQuestionIndex + 1}</div>
            <div class="question-text">${q.question}</div>
            <div class="options-container">
                ${q.options.map((opt, i) => `
                    <button class="option-btn" onclick="selectOption(${i})">${opt.text}</button>
                `).join('')}
            </div>
        </div>
    `;
}

window.selectOption = (optionIndex) => {
    const q = questions[currentQuestionIndex];
    const selectedOption = q.options[optionIndex];
    
    // Add scores
    for (let key in selectedOption.score) {
        scores[key] += selectedOption.score[key];
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
};

function showResult() {
    let result;
    if (scores.competitive > scores.relaxed) {
        if (scores.action >= scores.strategy) {
            result = results[0]; // competitive-action
        } else {
            result = results[2]; // competitive-strategy
        }
    } else {
        if (scores.action >= scores.story) {
            result = results[1]; // relaxed-action
        } else {
            result = results[3]; // relaxed-story
        }
    }

    testContainer.innerHTML = `
        <div class="result-box">
            <div class="result-title">${result.title}</div>
            <div class="result-description">${result.description}</div>
            <div class="recommend-label">추천 게임:</div>
            <div class="game-list">
                ${result.games.map(game => `<span class="game-tag">${game}</span>`).join('')}
            </div>
        </div>
    `;

    startBtn.innerText = '다시 테스트하기';
    startBtn.style.display = 'inline-block';
}
