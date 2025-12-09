const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
// ★ DB 라이브러리 추가
const Database = require("better-sqlite3");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// ===== DB 설정 (파일로 저장됨) =====
// 폴더에 'quiz.db' 라는 파일이 자동으로 생깁니다.
const db = new Database("quiz.db");

// 테이블(엑셀 시트 같은 것)이 없으면 만듭니다.
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

// 1. 점수 제출 (저장)
app.post("/api/submit", (req, res) => {
  try {
    const { name, score, total, referer } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ ok: false, error: "이름을 입력하세요." });
    }

    const saveDate = new Date().toLocaleString("ko-KR", { hour12: false });
    const saveReferer = referer || "-";

    // ★ DB에 데이터 삽입 (INSERT)
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

// 2. 점수 목록 조회 (불러오기)
app.get("/api/scores", (_req, res) => {
  try {
    // ★ DB에서 데이터 가져오기 (최신순 정렬)
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
