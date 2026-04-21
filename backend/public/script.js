// ===== 1. URL에서 사번(code) 추출 (예: ?code=202401) =====
const urlParams = new URLSearchParams(window.location.search);
const referralCode = urlParams.get("code") || ""; 

const quizData = [
  { 
    question: "알츠하이머 치료 신약(레카네마브)은 치매의 원인 물질인 '베타 아밀로이드'를 직접 제거하는 원리이다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "항체 주사 치료는 인지 기능이 많이 저하된 '중증 치매' 단계에서 가장 드라마틱한 효과를 볼 수 있다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "'아포이(APOE) 4' 유전자 검사는 약의 효과를 높이기 위해서만 시행하며, 부작용과는 무관하다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "치매 예방 프로그램인 '슈퍼 브레인' 연구 결과, 생활 습관 교정만으로도 약물 이상의 인지 개선 효과를 볼 수 있음이 입증되었다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "협심증(I20) 환자가 운동 중 가슴 통증을 느끼다가 휴식을 취했는데 통증이 사라졌다면, 이는 완치된 것으로 보아야 한다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "관상동맥 우회술(CABG)은 좁아진 혈관을 넓히는 것이 아니라, 다리나 가슴의 혈관을 떼어 '새로운 길'을 만들어 주는 대수술이다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "심장 근육 자체가 두꺼워지거나 늘어나는 '심근병증(I42~43)'은 혈관 문제이므로 스텐트 시술로 해결할 수 있다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "부정맥 중 '심방세동(I48)' 환자는 심장에서 생긴 피떡(혈전)이 뇌로 올라가 발생하는 '뇌경색'을 특히 조심해야 한다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "인공 심박동기(Pacemaker) 삽입술은 한 번의 수술로 평생 관리가 필요 없으며, 보험금도 최초 1회만 지급받으면 충분하다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "대법원 판례에 따라, 1세대 실손(2009년 이전) 가입자라도 실제 지출하지 않은 '병원비 할인액'은 보상 대상에서 제외된다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "헌혈 증서를 제출하고 병원비를 감면받은 경우, 실손보험에서는 이를 보상하지 않는다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "병원 직원 할인이라도 해당 할인액이 본인의 '근로소득'에 포함되어 세금을 냈다면, 실손에서 감면 전 의료비로 인정받을 수 있다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "비급여 표적항암제는 건강보험 산정특례가 적용되더라도 환자가 비용의 100%를 전액 부담해야 한다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "해외여행 중 사고로 '에어 앰뷸런스'를 이용해 한국으로 이송될 경우, 비용은 보통 1~2천만 원 내외로 저가형 보험으로도 충분히 커버된다.", 
    answer: false,
    score: 6.25 
  },
  { 
    question: "암 특정치료 생활비 담보는 진단비와 다르게 수술, 항암, 방사선 등 치료가 중복될수록 보험금이 비례하여 늘어나는 구조를 가질 수 있다.", 
    answer: true,
    score: 6.25 
  },
  { 
    question: "비급여 표적항암제는 1회 투여에 수백만 원, 연간 약 7,000만 원 내외의 고액 비용이 발생할 수 있다.", 
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
