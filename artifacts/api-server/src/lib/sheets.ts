import { google } from "googleapis";
import fs from "fs";
import path from "path";

const ID_FILE = path.join(process.cwd(), ".spreadsheet_id");
const SHEET_NAME = "Results";
const HEADERS = [
  "Student ID",
  "Grade",
  "Passage ID",
  "Passage Title",
  "Date",
  "Correct",
  "Incorrect",
  "Score",
  "Timestamp",
];

let connectionSettings: any;

async function getAccessToken() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error("X-Replit-Token not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" +
      hostname +
      "/api/v2/connection?include_secrets=true&connector_names=google-sheet",
    {
      headers: {
        Accept: "application/json",
        "X-Replit-Token": xReplitToken,
      },
    }
  )
    .then((res) => res.json() as Promise<{ items?: any[] }>)
    .then((data) => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error("Google Sheet not connected");
  }
  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth: oauth2Client });
}

async function getSpreadsheetId(): Promise<string> {
  if (process.env.SPREADSHEET_ID) return process.env.SPREADSHEET_ID;
  if (fs.existsSync(ID_FILE)) return fs.readFileSync(ID_FILE, "utf8").trim();
  return await createSpreadsheet();
}

async function createSpreadsheet(): Promise<string> {
  const sheets = await getUncachableGoogleSheetClient();
  const res = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: "DIBELS Maze CBM Results" },
      sheets: [{ properties: { title: SHEET_NAME } }],
    },
  });
  const id = res.data.spreadsheetId!;
  console.log(`Created spreadsheet: ${id}`);
  try {
    fs.writeFileSync(ID_FILE, id);
  } catch {
    console.warn(`Could not persist spreadsheet ID to file. Set SPREADSHEET_ID=${id} as an env var to avoid re-creating on restart.`);
  }
  await ensureHeaders(id);
  return id;
}

async function ensureHeaders(spreadsheetId: string) {
  const sheets = await getUncachableGoogleSheetClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:I1`,
  });
  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }
}

export interface ResultRow {
  rowIndex: number;
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
  const spreadsheetId = await getSpreadsheetId();
  const sheets = await getUncachableGoogleSheetClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:I`,
  });
  const rows = res.data.values ?? [];
  const dataRows = rows.slice(1);
  const studentRows = dataRows.filter(
    (r) => String(r[0]).trim() === String(studentId).trim()
  );
  const completedPassages = studentRows.map((r) => String(r[2]));
  const grade =
    studentRows.length > 0 ? Number(studentRows[studentRows.length - 1][1]) : null;
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
  const spreadsheetId = await getSpreadsheetId();
  await ensureHeaders(spreadsheetId);
  const sheets = await getUncachableGoogleSheetClient();
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:I`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          data.studentId,
          data.grade,
          data.passageId,
          data.passageTitle,
          date,
          data.correct,
          data.incorrect,
          data.score,
          now.toISOString(),
        ],
      ],
    },
  });
}

export async function getAllResults(): Promise<ResultRow[]> {
  const spreadsheetId = await getSpreadsheetId();
  const sheets = await getUncachableGoogleSheetClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:I`,
  });
  const rows = res.data.values ?? [];
  return rows.slice(1).map((r, i) => ({
    rowIndex: i + 2,
    studentId: String(r[0] ?? ""),
    grade: Number(r[1] ?? 0),
    passageId: String(r[2] ?? ""),
    passageTitle: String(r[3] ?? ""),
    date: String(r[4] ?? ""),
    correct: Number(r[5] ?? 0),
    incorrect: Number(r[6] ?? 0),
    score: Number(r[7] ?? 0),
    timestamp: String(r[8] ?? ""),
  }));
}

export async function deleteResult(rowIndex: number): Promise<void> {
  const spreadsheetId = await getSpreadsheetId();
  const sheets = await getUncachableGoogleSheetClient();
  const sheetRes = await sheets.spreadsheets.get({ spreadsheetId });
  const sheet = sheetRes.data.sheets?.find(
    (s) => s.properties?.title === SHEET_NAME
  );
  const sheetId = sheet?.properties?.sheetId ?? 0;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}

export async function getSpreadsheetUrl(): Promise<string> {
  const id = await getSpreadsheetId();
  return `https://docs.google.com/spreadsheets/d/${id}`;
}
