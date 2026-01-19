// ===== 1. URL에서 사번(code) 추출 (예: ?code=202401) =====
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get("code") || ""; 

// ===== 2. 운전자 위험도 자가진단 데이터 =====
const quizData = [
  { 
    question: "여성생애질병1-5종 수술비에서 자궁근종 수술 시 나이에 상관없이 4종으로 지급된다.", 
    // desc: "💡 비보호 사고는 쌍방 과실이 많고, 대인 사고 발생 시 형사 합의가 필요할 수 있습니다.",
    score: 10 
  },
  { 
    question: "여성질환 중 '자궁탈출증'은 여성 10명 중 3명이 앓고 있는 흔한 질병이다.", 
    // desc: "💡 주유소, 상가 진입 시 '인도 침범' 사고는 12대 중과실에 해당합니다.",
    score: 10 
  },
  { 
    question: "자궁근종은 폐경 후 일반적으로 근종의 크기가 커진다", 
    // desc: "💡 딜레마존 진입은 '신호위반' 사고의 가장 흔한 케이스입니다.",
    score: 10 
  },
  { 
    question: "집 근처에 '어린이 보호구역(스쿨존)'이나 노인 보호구역이 있나요?", 
    // desc: "💡 스쿨존 사고는 일반 사고와 달리 벌금 단위가 훨씬 크고 처벌이 무겁습니다.",
    score: 10 
  },
  { 
    question: "차선이 좁고 복잡한 재래시장이나 골목길을 자주 통과하시나요?", 
    // desc: "💡 골목길은 불쑥 튀어나오는 보행자와의 접촉 사고 위험이 매우 높습니다.",
    score: 10 
  },
  { 
    question: "우회전 시 '일시정지'를 해야 하는지 헷갈리거나, 그냥 지나친 적이 있나요?", 
    desc: "💡 강화된 도로교통법에 따라 우회전 단속 및 신호 위반 가능성이 높습니다.",
    score: 10 
  },
  { 
    question: "운전 중 네비게이션 조작이나 동승자와 대화를 자주 하시나요?", 
    desc: "💡 전방 주시 태만은 운전자가 인지하지 못한 상황에서 큰 사고를 유발합니다.",
    score: 10 
  },
  { 
    question: "초행길에서 차선을 잘못 들어 급하게 차선을 변경해 본 경험이 있나요?", 
    desc: "💡 무리한 차선 변경은 '끼어들기 금지 위반' 및 '지시 위반' 위험이 있습니다.",
    score: 10 
  },
  { 
    question: "전동 킥보드나 오토바이가 갑자기 튀어나와 식은땀을 흘린 적이 있나요?", 
    desc: "💡 상대방 과실이라도 피해자가 사망/중상해를 입으면 운전자에게도 형사적 책임이 발생할 수 있습니다.",
    score: 20 // 중요도 2배
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
