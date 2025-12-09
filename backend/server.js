const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// ===== DB 설정 (Render 유료 디스크 사용 시) =====
// '/data' 경로는 Render Disk 설정과 일치해야 합니다.
// 로컬(내 컴퓨터) 테스트 시 에러가 나면 '/data' 부분을 지우고 "quiz.db"만 남기세요.
const dbPath = path.join("/data", "quiz.db"); 
const db = new Database(dbPath);

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    score INTEGER,
    total INTEGER,
    referer TEXT,
    date TEXT
  )
`);

// ===== API =====

// 1. 점수 제출
app.post("/api/submit", (req, res) => {
  try {
    const { name, score, total, referer } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ ok: false, error: "이름을 입력하세요." });
    }

    const saveDate = new Date().toLocaleString("ko-KR", { hour12: false });
    const saveReferer = referer || "-";

    const insert = db.prepare(`
      INSERT INTO scores (name, score, total, referer, date)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insert.run(name.trim(), score, total, saveReferer, saveDate);

    return res.json({ ok: true });
  } catch (e) {
    console.error("DB 저장 에러:", e);
    return res.status(500).json({ ok: false, error: "서버 오류" });
  }
});

// 2. 점수 목록 조회
app.get("/api/scores", (_req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM scores ORDER BY id DESC");
    const rows = stmt.all();
    
    res.json({ ok: true, data: rows });
  } catch (e) {
    console.error("DB 조회 에러:", e);
    res.status(500).json({ ok: false, error: "조회 실패" });
  }
});

// ===== Static files =====
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행중 (DB모드): http://localhost:${PORT}`);
});
