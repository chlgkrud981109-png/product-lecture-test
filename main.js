// Teachable Machine 모델 URL
const URL = "https://teachablemachine.withgoogle.com/models/TzZBuzJD-/";

let model, maxPredictions;

// 다크 모드 초기화
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';
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

// 모델 로드 함수 (샘플 코드 기반)
async function initModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("주술회전 모델 로드 완료");
    } catch (e) {
        console.error("모델 로드 중 오류 발생", e);
    }
}

// 이미지 핸들링 요소
const imageInput = document.getElementById('image-input');
const faceImage = document.getElementById('face-image');
const uploadArea = document.getElementById('upload-area');
const previewArea = document.getElementById('preview-area');
const loading = document.getElementById('loading');
const resultArea = document.getElementById('result-area');
const restartBtn = document.getElementById('restart-btn');

imageInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            faceImage.src = event.target.result;
            uploadArea.style.display = 'none';
            previewArea.style.display = 'block';
            loading.style.display = 'block';
            resultArea.style.display = 'none';
            
            // 이미지가 로드된 후 예측 수행
            faceImage.onload = async () => {
                await predict();
                loading.style.display = 'none';
                resultArea.style.display = 'block';
                restartBtn.style.display = 'inline-block';
            };
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

// 예측 함수 (샘플 코드의 predict 로직을 파일 업로드용으로 변형)
async function predict() {
    if (!model) await initModel();
    
    // 모델 예측 (이미지 요소를 직접 전달)
    const prediction = await model.predict(faceImage);
    
    // 일치율 순으로 정렬
    prediction.sort((a, b) => b.probability - a.probability);

    const topResult = prediction[0];
    
    // 캐릭터별 추가 설명
    const characterInfo = {
        "이타도리 유지": "넘쳐나는 주력과 엄청난 신체 능력! 당신은 이타도리 유지와 닮았습니다.",
        "후시구로 메구미": "냉철한 판단력과 식신을 다루는 재능. 당신은 후시구로 메구미와 닮았습니다.",
        "쿠기사키 노바라": "확고한 자아와 거침없는 성격! 당신은 쿠기사키 노바라와 닮았습니다.",
        "고죠 사토루": "말 그대로 '최강'. 압도적인 분위기를 풍기는 당신은 고죠 사토루입니다.",
        "게토 스구루": "차분하고 논리적인 면모. 당신은 게토 스구루와 닮은 분위기를 풍깁니다.",
        "젠인 마키": "주력이 없어도 실력으로 증명하는 강인함! 당신은 마키와 닮았습니다.",
        "이누마키 토게": "말 한마디에 담긴 무게. 당신은 이누마키 토게와 닮았습니다.",
        "판다": "누구보다 듬직한 동료! 당신은 판다와 닮았군요."
    };

    let resultHTML = `
        <div class="result-title">당신과 가장 닮은 주술사는...</div>
        <div class="result-name">${topResult.className}</div>
        <p class="subtitle">${characterInfo[topResult.className] || "주술고전의 자랑스러운 학생이군요!"}</p>
        <div class="prediction-bar-container">
    `;

    // 상위 5개 예측치 바 생성 (샘플 코드의 labelContainer 역할)
    for (let i = 0; i < Math.min(5, maxPredictions); i++) {
        const prob = (prediction[i].probability * 100).toFixed(0);
        resultHTML += `
            <div class="bar-item">
                <div class="bar-label">
                    <span>${prediction[i].className}</span>
                    <span>${prob}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill ${i === 0 ? 'top' : ''}" style="width: ${prob}%"></div>
                </div>
            </div>
        `;
    }

    resultHTML += `</div>`;
    resultArea.innerHTML = resultHTML;
}

// 다시 하기 버튼
restartBtn.addEventListener('click', () => {
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    resultArea.style.display = 'none';
    restartBtn.style.display = 'none';
    imageInput.value = '';
});

// 페이지 로드 시 모델 미리 로드
initModel();
