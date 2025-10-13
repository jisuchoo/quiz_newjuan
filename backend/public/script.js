// ===== 퀴즈 데이터 (원하실 때 자유롭게 교체하세요) =====
const quizData = [
  { question: "한화손해보험에서는 2025년 10월 13일 5가지 암 치료 별로 보상하는 '암(4대유사암제외)특정치료비(각연간1회한)'을 출시하였다.", answer: true },
  { question: "'암(4대유사암제외)특정치료비(각연간1회한)' 담보는 더건강한1040 상품에는 출시되지 않았다.", answer: false },
  { question: "'암(4대유사암제외)특정치료비(각연간1회한)' 담보는 치료 별 최대 3천만원까지 가입이 가능하다.", answer: true },
  { question: "'암(4대유사암제외)특정치료비(각연간1회한)' 담보는 최초 암 진단 후 10년 동안만 보장한다.", answer: false },
  { question: "'암(4대유사암제외)특정치료비(각연간1회한)' 중 중환자실치료의 경우 다른 치료의 절반(50%)만 가입 가능하다.", answer: true },
  { question: "'암(4대유사암제외)특정치료비(각연간1회한)' 담보가 보장하는 치료는 '수술', '항암방사선', '항암약물', '항암호르몬', '호스피스치료' 5가지이다.", answer: false },
  { question: "'암(4대유사암제외)특정치료비(종합병원)(각연간1회한)' 담보는 상급종합병원에서 치료 시 보상하지 않는다.", answer: false },
  { question: "'4대유사암특정치료비(각연간1회한)' 담보는 호스피스완화치료 시 보상하지 않는다.", answer: true },
  { question: "'암(4대유사암제외)특정치료비(종합병원)(각연간1회한)' 담보는 '암(4대유사암제외)특정치료비(상급종합병원Ⅲ)(각연간1회한)' 담보보다 30%가량 비싸다.", answer: true },
  { question: "'암(4대유사암제외)특정치료비(상급종합병원Ⅲ)(각연간1회한)' 담보의 '상급종합병원Ⅲ'는 '상급종합병원', '국립암센터', '지역암센터' 및 '원자력병원'을 말한다.", answer: false },
  
];

// ===== 상태 =====
let username = "";
let current = 0;
let score = 0;
const total = quizData.length;

// ===== 엘리먼트 =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const scoreText = document.getElementById("score-text");
const questionLabel = document.getElementById("question-label");
const questionEl = document.getElementById("question");

const buttons = document.querySelectorAll(".quiz-btn");
const finalText = document.getElementById("final-text");

// ===== 이벤트 =====
startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("이름을 입력하세요!");
    return;
  }
  username = name;

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  current = 0;
  score = 0;
  renderQuestion();
});


buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.getAttribute("data-answer") === "true";
    checkAnswer(val);
  });
});

// ===== 함수 =====
function renderQuestion() {
  if (current >= total) {
    return finishQuiz();
  }
  const q = quizData[current];
  questionEl.textContent = q.question;
  questionLabel.textContent = `문제 ${current + 1}`;
  progressText.textContent = `${current + 1} / ${total}`;
  scoreText.textContent = `점수: ${score}`;
  progressFill.style.width = `${(current / total) * 100}%`;
}

function checkAnswer(userAnswer) {
  const correct = quizData[current].answer;
  if (userAnswer === correct) score++;
  current++;

  setTimeout(() => {
    if (current < total) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }, 400);
}

function finishQuiz() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  progressFill.style.width = "100%";
  scoreText.textContent = `점수: ${score}`;
  finalText.textContent = `최종 점수: ${score} / ${total}`;

  // 서버 저장
  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: username, score, total })
  }).catch(err => console.error("결과 제출 실패:", err));
}
