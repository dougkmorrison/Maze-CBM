import { Passage } from "../data/passages";

export interface MazeToken {
  type: "word" | "blank" | "punctuation" | "space";
  text: string;
  choices?: string[];
  correctIndex?: number;
  blankIndex?: number;
}

export interface MazePassage {
  tokens: MazeToken[];
  totalBlanks: number;
}

// Fallback pool used only for grades 5-8 (key booklets don't include distractors)
const FALLBACK_DISTRACTORS = [
  "elephant", "mountain", "quickly", "table", "purple", "running", "bright",
  "jumped", "whispered", "carried", "painted", "climbed", "wondered", "finished",
  "teacher", "basket", "window", "journey", "season", "pattern", "village",
  "enormous", "gentle", "ancient", "narrow", "hollow", "distant", "graceful",
  "slowly", "carefully", "silently", "suddenly", "happily", "deeply", "nearly",
  "something", "another", "several", "between", "nothing", "perhaps", "whether",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickFallbackDistractors(correct: string, count: number): string[] {
  const pool = FALLBACK_DISTRACTORS.filter(
    (d) => d.toLowerCase() !== correct.toLowerCase() && d.length > 2
  );
  return shuffle(pool).slice(0, count);
}

function tokenizeText(text: string): Array<{ word: string }> {
  const words: Array<{ word: string }> = [];
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    words.push({ word: match[0] });
  }
  return words;
}

function splitIntoSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g) || [text];
}

export function buildMazePassage(passage: Passage): MazePassage {
  const sentences = splitIntoSentences(passage.text);

  const protectedSentences: Set<number> = new Set();
  if (passage.grade === 2) {
    protectedSentences.add(0);
    if (sentences.length > 1) protectedSentences.add(1);
    protectedSentences.add(sentences.length - 1);
  } else {
    protectedSentences.add(0);
    protectedSentences.add(sentences.length - 1);
  }

  const tokens: MazeToken[] = [];
  let globalWordIndex = 0;
  let blankCounter = 0;

  sentences.forEach((sentence, sentenceIndex) => {
    const isProtected = protectedSentences.has(sentenceIndex);
    const words = tokenizeText(sentence);

    words.forEach(({ word }) => {
      globalWordIndex++;
      const isEvery7th = globalWordIndex % 7 === 0;

      if (isEvery7th && !isProtected) {
        const trailingPunct = word.match(/([.,!?;:]+)$/)?.[1] || "";
        const cleanWord = word.replace(/[.,!?;:]+$/, "");

        // Use real DIBELS distractors if available for this blank
        const storedBlank = passage.blanks[blankCounter];
        let d1: string, d2: string;

        if (storedBlank && storedBlank.distractors.length === 2) {
          [d1, d2] = storedBlank.distractors as [string, string];
        } else {
          [d1, d2] = pickFallbackDistractors(cleanWord, 2) as [string, string];
        }

        const choices = shuffle([cleanWord, d1, d2]);
        const correctIndex = choices.findIndex(
          (c) => c.toLowerCase() === cleanWord.toLowerCase()
        );

        tokens.push({
          type: "blank",
          text: cleanWord,
          choices,
          correctIndex,
          blankIndex: blankCounter,
        });

        if (trailingPunct) {
          tokens.push({ type: "punctuation", text: trailingPunct });
        }

        blankCounter++;
      } else {
        tokens.push({ type: "word", text: word });
      }

      tokens.push({ type: "space", text: " " });
    });
  });

  return { tokens, totalBlanks: blankCounter };
}
