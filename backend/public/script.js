// ===== 퀴즈 데이터 (원하실 때 자유롭게 교체하세요) =====
const quizData = [
  { question: "한화손해보험에서는 2025년 9월 22일 치매담보인 '최경증치매및경증알츠하이머치매표적약물허가치료비'를 출시하였다.", answer: true },
  { question: "'최경증치매및경증알츠하이머치매표적약물허가치료비' 담보는 '한화 더 경증 간편건강보험'에서 가입 가능하다.", answer: false },
  { question: "'한화 치매간병보험' 상품은 현재 기본형, 무해지 두 가지 종으로 설계할 수 있다.", answer: false },
  { question: "'최경증치매및경증알츠하이머치매표적약물허가치료비' 담보는 경제적 여유가 있는 고객의 경우 '비갱신형' 담보로 가입하는 것이 좋다.", answer: false },
  { question: "'최경증치매및경증알츠하이머치매표적약물허가치료비' 담보는 계속하여 치료 시 '총 3번'에 걸쳐서 보험금이 지급된다.", answer: true },
  { question: "'최경증치매및경증알츠하이머치매표적약물허가치료비'는 '최초 1회', '8회이상', '18회이상' 의 3가지 세부 담보로 구성되어 있다.", answer: false },
  { question: "'한화 치매간병보험' 상품은 저해지로 설계 시 납입 완료 시점에 환급률이 100%를 넘을 수 있다.", answer: true },
  { question: "'최경증치매및경증알츠하이머치매표적약물허가치료비' 담보는 레켐비를 썼을 때만 지급이 가능하여 향후에 새로운 치료제가 나오면 보상이 되지 않는다.", answer: false },
  { question: "최경증치매는 CDR척도 1점인 경우이다.", answer: false },
  { question: "알츠하이머 치매 환자 수는 혈관성 치매 환자의 수보다 적다.", answer: false },
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
