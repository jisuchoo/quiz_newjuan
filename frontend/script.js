const quizData = [
  { question: "대한민국의 수도는 서울이다.", answer: true },
  { question: "지구는 태양 주위를 하루에 한 바퀴 돈다.", answer: false },
  { question: "한화손해보험 본사는 여의도에 있다.", answer: true },
  { question: "코끼리는 날 수 있다.", answer: false },
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
