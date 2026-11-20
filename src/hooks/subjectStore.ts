import AsyncStorage from "@react-native-async-storage/async-storage";

export type RecallRating = "forgot" | "partial" | "remembered";

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  nextReviewDate: string | null;
};

export type Topic = {
  id: string;
  name: string;
  cards: Flashcard[];
};

export type Subject = {
  id: string;
  name: string;
  topics: Topic[];
};

const STORAGE_KEY = "@smartreview/subjects";

const sampleCards: Record<string, { question: string; answer: string }> = {
  "math-1": {
    question: "¿Qué representa una variable en álgebra?",
    answer: "Un símbolo que representa un valor desconocido o que puede cambiar.",
  },
  "math-2": {
    question: "¿Cómo se escribe una ecuación lineal de una variable?",
    answer: "En la forma ax + b = 0, donde a es distinto de cero.",
  },
  "math-3": {
    question: "¿Qué condición define una función?",
    answer:
      "A cada elemento del dominio le corresponde exactamente un elemento del codominio.",
  },
  "math-4": {
    question: "¿Cuánto suman los ángulos interiores de un triángulo plano?",
    answer: "Suman 180 grados.",
  },
  "math-5": {
    question: "¿Cómo se calcula la media aritmética?",
    answer:
      "Se suman los valores y se divide el total para la cantidad de valores.",
  },
  "science-1": {
    question: "¿Cuál es la unidad básica de los seres vivos?",
    answer: "La célula.",
  },
  "science-2": {
    question: "¿Qué sistema transporta la sangre por el cuerpo?",
    answer: "El sistema circulatorio.",
  },
  "science-3": {
    question: "¿Qué es un ecosistema?",
    answer:
      "El conjunto de seres vivos y el medio físico que interactúan en un lugar.",
  },
  "science-4": {
    question: "¿Qué establece la conservación de la energía?",
    answer:
      "La energía no se crea ni se destruye; se transforma o se transfiere.",
  },
  "science-5": {
    question: "¿Cómo se llama el paso del agua líquida a vapor?",
    answer: "Evaporación.",
  },
  "history-1": {
    question: "¿Qué pueblo desarrolló la escritura cuneiforme en Mesopotamia?",
    answer: "Los sumerios.",
  },
  "history-2": {
    question: "¿Qué sistema predominó en gran parte de la Europa medieval?",
    answer: "El feudalismo.",
  },
  "history-3": {
    question: "¿En qué región europea comenzó el Renacimiento?",
    answer: "En Italia.",
  },
  "history-4": {
    question:
      "¿En qué ciudad ocurrió la Revolución de Quito del 10 de agosto de 1809?",
    answer: "En Quito.",
  },
  "history-5": {
    question: "¿En qué año terminó la Segunda Guerra Mundial?",
    answer: "En 1945.",
  },
};

function createTopic(id: string, name: string): Topic {
  const sampleCard = sampleCards[id];
  return {
    id,
    name,
    cards: sampleCard
      ? [
          {
            id: `sample-${id}`,
            ...sampleCard,
            nextReviewDate: null,
          },
        ]
      : [],
  };
}

export const initialSubjects: Subject[] = [
  {
    id: "subject-matematicas",
    name: "Matemáticas",
    topics: [
      createTopic("math-1", "Álgebra"),
      createTopic("math-2", "Ecuaciones lineales"),
      createTopic("math-3", "Funciones"),
      createTopic("math-4", "Geometría"),
      createTopic("math-5", "Estadística"),
    ],
  },
  {
    id: "subject-ciencias",
    name: "Ciencias naturales",
    topics: [
      createTopic("science-1", "La célula"),
      createTopic("science-2", "Sistemas del cuerpo humano"),
      createTopic("science-3", "Ecosistemas"),
      createTopic("science-4", "Materia y energía"),
      createTopic("science-5", "Ciclo del agua"),
    ],
  },
  {
    id: "subject-historia",
    name: "Historia",
    topics: [
      createTopic("history-1", "Civilizaciones antiguas"),
      createTopic("history-2", "Edad Media"),
      createTopic("history-3", "Renacimiento"),
      createTopic("history-4", "Independencia"),
      createTopic("history-5", "Historia contemporánea"),
    ],
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isFlashcard(value: unknown): value is Flashcard {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.question === "string" &&
    typeof value.answer === "string" &&
    (value.nextReviewDate === null || isDateKey(value.nextReviewDate))
  );
}

function normalizeSubjects(value: unknown): Subject[] | null {
  if (!Array.isArray(value)) return null;

  const subjects: Subject[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      !Array.isArray(item.topics)
    ) {
      return null;
    }

    const topics: Topic[] = [];
    for (const topic of item.topics) {
      if (
        !isRecord(topic) ||
        typeof topic.id !== "string" ||
        typeof topic.name !== "string"
      ) {
        return null;
      }

      const savedCards =
        topic.cards === undefined
          ? createTopic(topic.id, topic.name).cards
          : topic.cards;
      if (!Array.isArray(savedCards)) return null;

      const cards: Flashcard[] = [];
      for (const card of savedCards) {
        if (!isFlashcard(card)) return null;
        cards.push(card);
      }
      topics.push({ id: topic.id, name: topic.name, cards });
    }
    subjects.push({ id: item.id, name: item.name, topics });
  }
  return subjects;
}

export async function loadSubjectsFromStorage(): Promise<Subject[]> {
  const storedSubjects = await AsyncStorage.getItem(STORAGE_KEY);
  if (storedSubjects === null) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubjects));
    return initialSubjects;
  }

  const subjects = normalizeSubjects(JSON.parse(storedSubjects));
  if (!subjects) {
    throw new Error("Los datos guardados tienen un formato inválido.");
  }
  return subjects;
}

export async function saveSubjectsToStorage(subjects: Subject[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayDateKey() {
  return formatDateKey(new Date());
}

export function formatReviewDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

export function calculateNextReviewDate(
  rating: RecallRating,
  reviewedAt: Date = new Date(),
) {
  const intervalDays: Record<RecallRating, number> = {
    forgot: 0,
    partial: 1,
    remembered: 3,
  };
  const nextDate = new Date(
    reviewedAt.getFullYear(),
    reviewedAt.getMonth(),
    reviewedAt.getDate(),
    12,
  );
  nextDate.setDate(nextDate.getDate() + intervalDays[rating]);
  return formatDateKey(nextDate);
}
