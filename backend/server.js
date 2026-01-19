const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // 파일 시스템 모듈 추가
const Database = require("better-sqlite3");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// ===== DB 설정 (환경에 따른 경로 자동 선택) =====
// Render 유료 디스크(/data)가 있으면 해당 경로를 사용하고, 없으면 현재 폴더를 사용합니다.
const dbDir = "/data";
const dbPath = fs.existsSync(dbDir) 
  ? path.join(dbDir, "quiz.db") 
  : path.join(__dirname, "quiz.db");

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

// 3. 점수 데이터 전체 초기화 API
app.post("/api/reset", (req, res) => {
  try {
    db.prepare("DELETE FROM scores").run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name='scores'").run(); // No. 초기화
    res.json({ ok: true, message: "데이터가 모두 초기화되었습니다." });
  } catch (e) {
    console.error("DB 초기화 에러:", e);
    res.status(500).json({ ok: false, error: "초기화에 실패했습니다." });
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
