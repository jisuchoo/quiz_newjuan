const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 간단하게 메모리에 저장 (Render에서 DB연결하면 Postgres로 교체 가능)
let scores = [];

app.post("/api/submit", (req, res) => {
  const { name, score } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ error: "이름과 점수가 필요합니다." });
  }
  scores.push({ name, score, date: new Date().toLocaleString() });
  res.json({ success: true });
});

app.get("/api/scores", (req, res) => {
  res.json(scores);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행중: ${PORT}`));
