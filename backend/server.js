const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// ===== In-memory score store (재배포/재시작 시 초기화됩니다) =====
/**
 * scores = [
 *   { name: "홍길동", score: 3, total: 5, date: "2025-09-23 21:12:11" }
 * ]
 */
let scores = [];

// ===== API =====

// 점수 제출
app.post("/api/submit", (req, res) => {
  try {
    const { name, score, total } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ ok: false, error: "이름을 입력하세요." });
    }
    if (typeof score !== "number" || typeof total !== "number") {
      return res.status(400).json({ ok: false, error: "점수/총문항이 잘못되었습니다." });
    }
    if (score < 0 || total <= 0 || score > total) {
      return res.status(400).json({ ok: false, error: "점수 범위가 유효하지 않습니다." });
    }

    const record = {
      name: name.trim(),
      score,
      total,
      date: new Date().toLocaleString("ko-KR", { hour12: false })
    };

    scores.push(record);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "서버 오류" });
  }
});

// 점수 목록
app.get("/api/scores", (_req, res) => {
  // 최신순 정렬해서 전달
  const sorted = [...scores].reverse();
  res.json({ ok: true, data: sorted });
});

// ===== Static files =====
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// SPA 기본 라우트 (필요 시 주석 처리 가능)
app.get("*", (req, res) => {
  // /admin.html 같은 파일은 위 static 미들웨어에서 먼저 처리됩니다.
  res.sendFile(path.join(staticDir, "index.html"));
});

// Render가 PORT 환경변수를 제공합니다.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행중: http://localhost:${PORT}`);
});
