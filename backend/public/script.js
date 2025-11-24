// ===== 퀴즈 데이터 (원하실 때 자유롭게 교체하세요) =====
const quizData = [
  { question: "12월 11일부터 운전자보험의 변호사선임비가 심급 별 500만원으로 축소된다", answer: true },
  { question: "운전자보험에서 피해자가 42일 미만 치료를 요할때 대인형사합의실손비는 최대 2천만원까지 지급된다", answer: false },
  { question: "운전자보험의 대인벌금 담보는 스쿨존 사고에서 최대 3천만원까지 지급된다", answer: true },
  { question: "운전자보험에서 12대중과실 사고가 아닌 경우, 부상등급 1~3급에 해당할 때에만 형사합의금이 지급된다", answer: false },
  { question: "운전자보험에서 변호사선임비용은 최대 5천만원까지 가입이 가능하다", answer: true },
  { question: "타 보험사보다 한화손보의 운전자보험의 이점은 크게 다치지 않은 경우(의사소견상 중상해)에도 보험금이 지급된다는 점이다", answer: true },
  { question: "중상해 사고로 검찰에 기소된 경우, 부상등급이 1~3급이 아니어도 형사합의금이 2억까지 지급된다 ", answer: true },
  { question: "중상해 사고로 부상등급 1~3급에 해당하면, 검찰에 기소되지 않아도 형사합의금이 2억까지 지급된다", answer: true },
  { question: "12대 중과실 사고가 아닌 경우, 재판을 하지 않는다면 변호사 선임비용은 최대 3천만원까지 지급된다", answer: true },
  { question: "12월 11일부터 운전자보험의 변호사선임비의 자기부담금이 50%로 생길 예정이다", answer: true },
  
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
