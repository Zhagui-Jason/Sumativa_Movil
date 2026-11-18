import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Topic = {
  id: string;
  name: string;
};

export type Subject = {
  id: string;
  name: string;
  topics: Topic[];
};

const STORAGE_KEY = "@smartreview/subjects";

const initialSubjects: Subject[] = [
  {
    id: "subject-matematicas",
    name: "Matemáticas",
    topics: [
      { id: "math-1", name: "Álgebra" },
      { id: "math-2", name: "Ecuaciones lineales" },
      { id: "math-3", name: "Funciones" },
      { id: "math-4", name: "Geometría" },
      { id: "math-5", name: "Estadística" },
    ],
  },
  {
    id: "subject-ciencias",
    name: "Ciencias naturales",
    topics: [
      { id: "science-1", name: "La célula" },
      { id: "science-2", name: "Sistemas del cuerpo humano" },
      { id: "science-3", name: "Ecosistemas" },
      { id: "science-4", name: "Materia y energía" },
      { id: "science-5", name: "Ciclo del agua" },
    ],
  },
  {
    id: "subject-historia",
    name: "Historia",
    topics: [
      { id: "history-1", name: "Civilizaciones antiguas" },
      { id: "history-2", name: "Edad Media" },
      { id: "history-3", name: "Renacimiento" },
      { id: "history-4", name: "Independencia" },
      { id: "history-5", name: "Historia contemporánea" },
    ],
  },
];

type SubjectsContextValue = {
  subjects: Subject[];
  isLoading: boolean;
  loadError: string | null;
  addSubject: (name: string) => Promise<void>;
  addTopic: (subjectId: string, name: string) => Promise<void>;
};

const SubjectsContext = createContext<SubjectsContextValue | null>(null);

function isTopic(value: unknown): value is Topic {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const topic = value as Record<string, unknown>;
  return typeof topic.id === "string" && typeof topic.name === "string";
}

function isSubject(value: unknown): value is Subject {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const subject = value as Record<string, unknown>;
  return (
    typeof subject.id === "string" &&
    typeof subject.name === "string" &&
    Array.isArray(subject.topics) &&
    subject.topics.every(isTopic)
  );
}

function isSubjectList(value: unknown): value is Subject[] {
  return Array.isArray(value) && value.every(isSubject);
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function SubjectsProvider({ children }: PropsWithChildren) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubjects() {
      try {
        const storedSubjects = await AsyncStorage.getItem(STORAGE_KEY);
        let nextSubjects: Subject[];

        if (storedSubjects === null) {
          nextSubjects = initialSubjects;
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSubjects));
        } else {
          const parsed: unknown = JSON.parse(storedSubjects);
          if (!isSubjectList(parsed)) {
            throw new Error("Los datos guardados tienen un formato inválido.");
          }
          nextSubjects = parsed;
        }

        if (isMounted) {
          setSubjects(nextSubjects);
          setLoadError(null);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            `No se pudieron cargar las materias. ${
              error instanceof Error ? error.message : "Inténtalo de nuevo."
            }`,
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  async function saveSubjects(nextSubjects: Subject[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSubjects));
    setSubjects(nextSubjects);
  }

  async function addSubject(name: string) {
    const subject = { id: createId(), name: name.trim(), topics: [] };
    await saveSubjects([...subjects, subject]);
  }

  async function addTopic(subjectId: string, name: string) {
    const nextSubjects = subjects.map((subject) =>
      subject.id === subjectId
        ? {
            ...subject,
            topics: [...subject.topics, { id: createId(), name: name.trim() }],
          }
        : subject,
    );

    if (!nextSubjects.some((subject) => subject.id === subjectId)) {
      throw new Error("No se encontró la materia seleccionada.");
    }

    await saveSubjects(nextSubjects);
  }

  return (
    <SubjectsContext.Provider
      value={{ subjects, isLoading, loadError, addSubject, addTopic }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error("useSubjects debe usarse dentro de SubjectsProvider.");
  }
  return context;
}
