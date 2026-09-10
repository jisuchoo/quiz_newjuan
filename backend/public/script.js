// ===== 1. URL에서 사번(code) 추출 (예: ?code=202401) =====
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get("code") || ""; 

const quizData = [
  { 
    question: "출산지원금 담보는 1년 면책기간만 있으며, 감액기간은 없다", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "제왕절개수술비 담보는 100만원까지 가입 가능하다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "산후조리원 담보는 1년 면책기간만 있으며, 감액기간은 없다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "난임치료후산후관리지원금은 난임치료 후 출산 시 최대 400만원을 지급한다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "여성생애1-5종수술비는 49세 이전에 자궁근종 관혈수술 시 4종으로 지급한다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "여성생애1-5종수술비는 50세 이후에 디스크 수술 시 4종으로 지급한다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "유갑생,여성생애,로봇수술 담보를 가입 후 자궁근종 수술 시 최대 800만원을 지급한다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "가입 전 자궁근종을 보유한 사람은 해당 질환으로 수술시 수술비를 받을 수 있는 상품이 없다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "한화손보 간병인사용입원생활비는 '8시간'이상 간병인을 사용해야지만 보상 가능하다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "간병인사용입원생활비(요양병원) 담보는 365일 3만원, 단독으로 가입 가능하다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "한화손보 간병인사용입원생활비는 상해로 입원 시에도 하루도 빠짐없이 보상 가능하다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "정부는 2019년 일반검진을 20대까지 확대하였다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "일반검진을 20대까지 확대한 이유는 암 발생 연령이 20대로 낮아져서 이다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "대장용종 진단코드인 D12.6로 수술 시 질병수술비(특정2대경증질병제외)에서 보상하지 않는다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "건강검진에서 대장용종을 제거한 경우 질병1-5종 수술비에서 1종으로 지급된다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "지점장은 비만이다", 
    answer: false,
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

  // 점수 표시 (소수점 제거)
  const displayScore = Math.floor(score);
  finalScore.textContent = `${displayScore}점`;
  
  resultBadge.className = "result-badge";

  if (score >= 90) {
    resultBadge.textContent = "🏆 정보미팅 전문가";
    resultBadge.classList.add("bg-safe");
    finalMessage.innerHTML = `대단합니다! <b>${username}</b>님은 신주안 정보미팅의 핵심을 완벽히 마스터하셨습니다. <br>지점의 전문 리더로서 적극적인 활동이 기대됩니다! ✨`;
  } else if (score >= 60) {
    resultBadge.textContent = "⭐ 우수한 실력";
    resultBadge.classList.add("bg-warn");
    finalMessage.innerHTML = `훌륭한 성적입니다! <b>${username}</b>님, 부족한 부분을 조금만 더 보완하면 현장에서 최고의 무기가 될 것입니다. 👍`;
  } else {
    resultBadge.textContent = "📚 학습 필요";
    resultBadge.classList.add("bg-danger");
    finalMessage.innerHTML = `아쉬운 결과입니다. <b>${username}</b>님, 신주안 정보미팅을 다시 한번 숙지하여 고객에게 더 정확한 가치를 전달해 보세요! 🔥`;
  }

  // 서버 전송 (기존 유지)
  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name: username, 
      score: displayScore, 
      total: maxPossibleScore,
      referer: referralCode 
    })
  }).catch(err => console.error("결과 전송 실패:", err));
}
