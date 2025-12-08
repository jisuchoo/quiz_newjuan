// ===== 1. URL에서 사번(code) 추출 (예: ?code=202401) =====
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get("code") || ""; 

// ===== 2. 운전자 위험도 자가진단 데이터 =====
const quizData = [
  { 
    question: "출퇴근길이나 자주 가는 곳에 '비보호 좌회전' 신호가 있나요?", 
    desc: "💡 비보호 사고는 쌍방 과실이 많고, 대인 사고 발생 시 형사 합의가 필요할 수 있습니다.",
    score: 10 
  },
  { 
    question: "집이나 회사 주차장 진입 시, 인도를 밟고 지나가야 하나요?", 
    desc: "💡 주유소, 상가 진입 시 '인도 침범' 사고는 12대 중과실에 해당합니다.",
    score: 10 
  },
  { 
    question: "출근길 마음이 급해 '황색불(딜레마존)'에 교차로를 통과한 적이 있나요?", 
    desc: "💡 딜레마존 진입은 '신호위반' 사고의 가장 흔한 케이스입니다.",
    score: 10 
  },
  { 
    question: "집 근처에 '어린이 보호구역(스쿨존)'이나 노인 보호구역이 있나요?", 
    desc: "💡 스쿨존 사고는 일반 사고와 달리 벌금 단위가 훨씬 크고 처벌이 무겁습니다.",
    score: 10 
  },
  { 
    question: "차선이 좁고 복잡한 재래시장이나 골목길을 자주 통과하시나요?", 
    desc: "💡 골목길은 불쑥 튀어나오는 보행자와의 접촉 사고 위험이 매우 높습니다.",
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
  if (isYes) {
    score += quizData[current].score;
  }
  current++;
  setTimeout(() => renderQuestion(), 150);
}

function finishQuiz() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  finalScore.textContent = `${score}점`;
  resultBadge.className = "result-badge";
  finalScore.className = "final-score-text";

  if (score >= 60) {
    resultBadge.textContent = "운전자보험 필수";
    resultBadge.classList.add("bg-danger");
    finalScore.classList.add("text-danger");
    finalMessage.innerHTML = `🚨 위험합니다!<br><b>${username}</b>님의 운전 환경은 '12대 중과실' 및 돌발 사고 위험에 매우 많이 노출되어 있습니다.<br><br>지금 운전자보험이 없다면<br>사고 시 <b>형사적 책임과 비용</b>을 온전히 감당해야 합니다.<br>전문가와 즉시 상담하세요.`;
  } else if (score >= 30) {
    resultBadge.textContent = "보장 점검 추천";
    resultBadge.classList.add("bg-warn");
    finalScore.classList.add("text-warn");
    finalMessage.innerHTML = `<b>${username}</b>님은 평소 안전운전을 하시지만,<br>도로 환경상 언제든 억울한 사고에 휘말릴 수 있습니다.<br><br>만약을 대비해<br><b>변호사 선임비용</b>과 <b>벌금</b> 한도가 충분한지<br>점검해보시는 것을 추천합니다. 🤔`;
  } else {
    resultBadge.textContent = "안전 운전 중";
    resultBadge.classList.add("bg-safe");
    finalScore.classList.add("text-safe");
    finalMessage.innerHTML = `훌륭합니다! 👍<br><b>${username}</b>님은 매우 안전한 환경에서 운전하고 계시네요.<br><br>하지만 '민식이법' 등 법률이 계속 강화되고 있으니,<br>최신 법규에 맞춰 보험을 한번 가볍게 살펴보시면<br>더욱 완벽할 것입니다.`;
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
