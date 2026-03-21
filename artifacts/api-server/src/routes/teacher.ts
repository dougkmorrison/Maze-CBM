import { Router } from "express";
import { getAllResults, deleteResult, getSpreadsheetUrl } from "../lib/sheets";

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD ?? "1234";

const router = Router();

function checkAuth(req: any, res: any): boolean {
  const pw = req.headers["x-teacher-password"] ?? req.query.pw;
  if (pw !== TEACHER_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.get("/teacher/results", async (req, res) => {
  if (!checkAuth(req, res)) return;
  try {
    const rows = await getAllResults();
    const url = await getSpreadsheetUrl();
    return res.json({ rows, spreadsheetUrl: url });
  } catch (err: any) {
    console.error("teacher/results error:", err.message);
    return res.status(500).json({ error: "Failed to load results" });
  }
});

router.delete("/teacher/result/:rowIndex", async (req, res) => {
  if (!checkAuth(req, res)) return;
  const rowIndex = Number(req.params.rowIndex);
  if (!rowIndex || rowIndex < 2) {
    return res.status(400).json({ error: "Invalid row index" });
  }
  try {
    await deleteResult(rowIndex);
    return res.json({ success: true });
  } catch (err: any) {
    console.error("teacher/delete error:", err.message);
    return res.status(500).json({ error: "Failed to delete result" });
  }
});

router.get("/teacher/export", async (req, res) => {
  if (!checkAuth(req, res)) return;
  try {
    const rows = await getAllResults();
    const header = "Student ID,Grade,Passage ID,Passage Title,Date,Correct,Incorrect,Score,Timestamp";
    const csvRows = rows.map((r) =>
      [
        r.studentId,
        r.grade,
        r.passageId,
        `"${r.passageTitle.replace(/"/g, '""')}"`,
        r.date,
        r.correct,
        r.incorrect,
        r.score,
        r.timestamp,
      ].join(",")
    );
    const csv = [header, ...csvRows].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="dibels_results_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    return res.send(csv);
  } catch (err: any) {
    console.error("teacher/export error:", err.message);
    return res.status(500).json({ error: "Failed to export" });
  }
});

export default router;
