const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// ===== 데이터 저장소 (메모리) =====
// 서버가 재시작되면 초기화됩니다. (영구 저장이 필요하면 DB 연동 필요)
let scores = [];

// ===== API =====

// 결과 제출
app.post("/api/submit", (req, res) => {
  try {
    // referer(사번) 항목 수신 추가
    const { name, score, total, referer } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ ok: false, error: "이름을 입력하세요." });
    }
    
    // 데이터 저장 객체 생성
    const record = {
      name: name.trim(),
      score,
      total,
      referer: referer || "-", // 사번이 없으면 '-'로 저장
      date: new Date().toLocaleString("ko-KR", { hour12: false })
    };

    scores.push(record);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "서버 오류" });
  }
});

// 결과 목록 조회 (관리자용)
app.get("/api/scores", (_req, res) => {
  // 최신순 정렬
  const sorted = [...scores].reverse();
  res.json({ ok: true, data: sorted });
});

// ===== Static files =====
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// SPA 기본 라우트
app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행중: http://localhost:${PORT}`);
});
