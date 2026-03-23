import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getApp() {
  if (getApps().length > 0) return getApps()[0]!;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!projectId || !serviceAccountJson) {
    throw new Error(
      "FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT env vars are required"
    );
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  return initializeApp({
    credential: cert(serviceAccount),
    projectId,
  });
}

export function getDb() {
  getApp();
  return getFirestore();
}

const COLLECTION = "maze_results";

export interface ResultRow {
  id: string;
  studentId: string;
  grade: number;
  passageId: string;
  passageTitle: string;
  date: string;
  correct: number;
  incorrect: number;
  score: number;
  timestamp: string;
}

export async function getStudentResults(studentId: string): Promise<{
  completedPassages: string[];
  grade: number | null;
}> {
  const db = getDb();
  const snap = await db
    .collection(COLLECTION)
    .where("studentId", "==", studentId)
    .get();

  const docs = snap.docs.sort((a, b) =>
    String(a.data().timestamp).localeCompare(String(b.data().timestamp))
  );
  const completedPassages = docs.map((d) => String(d.data().passageId));
  const grade =
    docs.length > 0 ? Number(docs[docs.length - 1]!.data().grade) : null;

  return { completedPassages, grade };
}

export async function saveResult(data: {
  studentId: string;
  grade: number;
  passageId: string;
  passageTitle: string;
  correct: number;
  incorrect: number;
  score: number;
}): Promise<void> {
  const db = getDb();
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await db.collection(COLLECTION).add({
    studentId: data.studentId,
    grade: data.grade,
    passageId: data.passageId,
    passageTitle: data.passageTitle,
    date,
    correct: data.correct,
    incorrect: data.incorrect,
    score: data.score,
    timestamp: now.toISOString(),
  });
}

export async function getAllResults(): Promise<ResultRow[]> {
  const db = getDb();
  const snap = await db
    .collection(COLLECTION)
    .orderBy("timestamp", "desc")
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      studentId: String(data.studentId ?? ""),
      grade: Number(data.grade ?? 0),
      passageId: String(data.passageId ?? ""),
      passageTitle: String(data.passageTitle ?? ""),
      date: String(data.date ?? ""),
      correct: Number(data.correct ?? 0),
      incorrect: Number(data.incorrect ?? 0),
      score: Number(data.score ?? 0),
      timestamp: String(data.timestamp ?? ""),
    };
  });
}

export async function deleteResult(id: string): Promise<void> {
  const db = getDb();
  await db.collection(COLLECTION).doc(id).delete();
}
