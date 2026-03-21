import { Passage } from "../data/passages";

export interface MazeToken {
  type: "word" | "blank";
  text: string;
  choices?: string[];
  correctIndex?: number;
  blankIndex?: number;
}

export interface MazePassage {
  tokens: MazeToken[];
  totalBlanks: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildMazePassage(passage: Passage): MazePassage {
  const tokens: MazeToken[] = [];

  passage.segments.forEach((segment, i) => {
    if (segment) {
      tokens.push({ type: "word", text: segment });
    }

    if (i < passage.blanks.length) {
      const blank = passage.blanks[i];
      const allChoices = [blank.correct, ...blank.distractors].slice(0, 3);
      const choices = shuffle(allChoices);
      const correctIndex = choices.findIndex(
        (c) => c.toLowerCase() === blank.correct.toLowerCase()
      );

      tokens.push({
        type: "blank",
        text: blank.correct,
        choices,
        correctIndex,
        blankIndex: i,
      });
    }
  });

  return { tokens, totalBlanks: passage.blanks.length };
}
