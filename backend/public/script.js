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

let current = 0;
let score = 0;
let username = "";

function startQuiz() {
  username = document.getElementById("username").value.trim();
  if (!username) {
    alert("이름을 입력하세요!");
    return;
  }
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  if (current < quizData.length) {
    document.getElementById("question").innerText = quizData[current].question;
    document.getElementById("result").innerText = "";
    document.getElementById("score").innerText = `현재 점수: ${score} / ${quizData.length}`;
  } else {
    document.getElementById("question").innerText = "🎉 퀴즈 완료!";
    document.querySelector(".buttons").style.display = "none";
    document.getElementById("result").innerText = `최종 점수: ${score} / ${quizData.length}`;

    // 서버에 결과 전송
    fetch("https://YOUR_RENDER_URL/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, score })
    });
  }
}

function checkAnswer(userAnswer) {
  if (quizData[current].answer === userAnswer) {
    document.getElementById("result").innerText = "✅ 정답!";
    score++;
  } else {
    document.getElementById("result").innerText = "❌ 오답!";
  }
  current++;
  setTimeout(loadQuestion, 1000);
}
