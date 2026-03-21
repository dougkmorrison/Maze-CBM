import { Router } from "express";
import { getStudentResults, saveResult } from "../lib/sheets";

const router = Router();

router.post("/student/login", async (req, res) => {
  const { studentId } = req.body;
  if (!studentId || !/^\d{10}$/.test(String(studentId))) {
    return res.status(400).json({ error: "Student ID must be exactly 10 digits" });
  }
  try {
    const data = await getStudentResults(String(studentId));
    return res.json(data);
  } catch (err: any) {
    console.error("student/login error:", err.message);
    return res.status(500).json({ error: "Failed to load student data" });
  }
});

router.post("/student/result", async (req, res) => {
  const { studentId, grade, passageId, passageTitle, correct, incorrect, score } =
    req.body;
  if (!studentId || !grade || !passageId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    await saveResult({
      studentId: String(studentId),
      grade: Number(grade),
      passageId: String(passageId),
      passageTitle: String(passageTitle),
      correct: Number(correct),
      incorrect: Number(incorrect),
      score: Number(score),
    });
    return res.json({ success: true });
  } catch (err: any) {
    console.error("student/result error:", err.message);
    return res.status(500).json({ error: "Failed to save result" });
  }
});

export default router;
