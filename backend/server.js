// 기존 코드 덮어쓰기 (전체 server.js를 아래 내용으로 교체하셔도 됩니다)
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(cors());

let scores = []; // 데이터 저장소

// ===== API =====

app.post("/api/submit", (req, res) => {
  try {
    // 1. referer(사번) 항목 추가 수신
    const { name, score, total, referer } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ ok: false, error: "이름을 입력하세요." });
    }

    const record = {
      name: name.trim(),
      score,
      total,
      // 2. 사번이 없으면 '-' 로 저장
      referer: referer || "-", 
      date: new Date().toLocaleString("ko-KR", { hour12: false })
    };

    scores.push(record);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "서버 오류" });
  }
});

app.get("/api/scores", (_req, res) => {
  const sorted = [...scores].reverse();
  res.json({ ok: true, data: sorted });
});

// ===== Static files =====
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행중: http://localhost:${PORT}`);
});
