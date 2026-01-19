// ===== 1. URL에서 사번(code) 추출 (예: ?code=202401) =====
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get("code") || ""; 

const quizData = [
  { 
    question: "여성생애질병1-5종 수술비에서 자궁근종 수술 시 나이에 상관없이 4종으로 지급된다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "여성질환 중 '자궁탈출증'은 여성 10명 중 3명이 앓고 있는 흔한 질병이다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "자궁근종은 폐경 후 일반적으로 근종의 크기가 커진다", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "자궁내막증으로 자궁내막세포가 침투한 장기는 생리때마다 출혈을 일으킨다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "난임이 많아진 가장 큰 원인은 출산연령의 고령화이다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "고령 산모의 기준은 만 40세이다", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "난임 치료는 일반적으로 인공수정과 체외수정이 있다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "시그니처4.0에서는 난임으로 인공수정 치료시 1회당 100만원을 지급한다", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "착상전유전검사(PGT-A)를 시행하면 유산율이 미시행 시에 비해 절반 이하로 감소하는 효과가 있다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "시그니처4.0에서는 착상전유전검사(PGT-A)를 시행하면 200만원을 지급하는 담보가 있다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "시그니처4.0의 임신지원금 담보는 임신을 할 때마다 보험금을 지급한다", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "시그니처4.0의 임신지원금 담보는 가입하고 1년내에 임신 0주 1일이 존재하면 면책이다", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "시그니처4.0의 출산지원금 담보는 첫 임신에서 쌍둥이를 출산했을 때 400만원을 지급한다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "시그니처4.0의 산후조리원비용 담보로 받을 수 있는 최대 보험금은 140만원이다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "시그니처4.0의 난임후출산 담보는 400만원까지 보상이 가능하다", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "최근 산후조리원 비용은 고급화 경쟁으로 인해 지속적으로 상승하는 추세이다", 
    answer: true,
    score: 6.25 
  },

];

// ===== 상태 관리 =====
let username = "";
let current = 0;
let score = 0; // 위험 점수
const totalQuestions = quizData.length;
const maxPossibleScore = 100;

// ===== DOM =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

const questionEl = document.getElementById("question");
const descEl = document.getElementById("quiz-desc");

const buttons = document.querySelectorAll(".quiz-btn");
const resultBadge = document.getElementById("result-badge");
const finalScore = document.getElementById("final-score");
const finalMessage = document.getElementById("final-message");

// ===== 이벤트 =====
startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (!name) {
    alert("성함을 입력해주세요!");
    return;
  }
  username = name;
  startGame();
});

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const isYes = btn.getAttribute("data-answer") === "yes";
    handleAnswer(isYes);
  });
});

restartBtn.addEventListener("click", () => {
  location.reload();
});

// ===== 로직 =====
function startGame() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  current = 0;
  score = 0;
  renderQuestion();
}

function renderQuestion() {
  if (current >= totalQuestions) {
    return finishQuiz();
  }
  const q = quizData[current];
  
  questionEl.textContent = q.question;
  descEl.textContent = q.desc;
  
  progressText.textContent = `${current + 1} / ${totalQuestions}`;
  progressFill.style.width = `${(current / totalQuestions) * 100}%`;
}

function handleAnswer(isYes) {
  const currentQuestion = quizData[current];
  
  // 사용자가 선택한 값(isYes)과 문제의 정답(currentQuestion.answer)이 일치하는지 확인
  if (isYes === currentQuestion.answer) {
    score += currentQuestion.score;
  }
  
  current++;
  setTimeout(() => renderQuestion(), 150);
}

function finishQuiz() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScore.textContent = `${score}점`;
  resultBadge.className = "result-badge";

  if (score >= 90) {
    resultBadge.textContent = "시그니처 전문가";
    resultBadge.classList.add("bg-safe"); // 초록색 계열
    finalMessage.innerHTML = `축하합니다! <b>${username}</b>님은 시그니처4.0의 핵심 내용을 완벽히 숙지하고 계시네요! 🏆`;
  } else if (score >= 60) {
    resultBadge.textContent = "우수한 실력";
    resultBadge.classList.add("bg-warn"); // 주황색 계열
    finalMessage.innerHTML = `훌륭합니다! <b>${username}</b>님, 조금만 더 보완하면 완벽한 전문가가 될 수 있습니다. 👍`;
  } else {
    resultBadge.textContent = "학습 필요";
    resultBadge.classList.add("bg-danger"); // 빨간색 계열
    finalMessage.innerHTML = `<b>${username}</b>님, 시그니처4.0 약관을 다시 한번 검토해보시면 영업에 큰 도움이 될 것 같습니다. 화이팅! 🔥`;
  }

  // ★ 사번(referer) 포함하여 전송
  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name: username, 
      score: score, 
      total: maxPossibleScore,
      referer: referralCode 
    })
  }).catch(err => console.error("결과 전송 실패:", err));
}
