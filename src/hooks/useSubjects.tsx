import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  calculateNextReviewDate,
  createId,
  loadSubjectsFromStorage,
  saveSubjectsToStorage,
  type Flashcard,
  type RecallRating,
  type Subject,
} from "./subjectStore";

type SubjectsContextValue = {
  subjects: Subject[];
  isLoading: boolean;
  loadError: string | null;
  addSubject: (name: string) => Promise<void>;
  addTopic: (subjectId: string, name: string) => Promise<void>;
  addFlashcard: (
    subjectId: string,
    topicId: string,
    question: string,
    answer: string,
  ) => Promise<void>;
  updateFlashcard: (
    subjectId: string,
    topicId: string,
    cardId: string,
    question: string,
    answer: string,
  ) => Promise<void>;
  deleteFlashcard: (
    subjectId: string,
    topicId: string,
    cardId: string,
  ) => Promise<void>;
  reviewFlashcard: (
    subjectId: string,
    topicId: string,
    cardId: string,
    rating: RecallRating,
  ) => Promise<void>;
};

const SubjectsContext = createContext<SubjectsContextValue | null>(null);

export function SubjectsProvider({ children }: PropsWithChildren) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubjects() {
      try {
        const savedSubjects = await loadSubjectsFromStorage();
        if (isMounted) {
          setSubjects(savedSubjects);
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
        if (isMounted) setIsLoading(false);
      }
    }

    void loadSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  async function saveSubjects(nextSubjects: Subject[]) {
    await saveSubjectsToStorage(nextSubjects);
    setSubjects(nextSubjects);
  }

  async function addSubject(name: string) {
    const newSubject: Subject = {
      id: createId(),
      name: name.trim(),
      topics: [],
    };
    await saveSubjects([...subjects, newSubject]);
  }

  async function addTopic(subjectId: string, name: string) {
    const subjectExists = subjects.some((subject) => subject.id === subjectId);
    if (!subjectExists) {
      throw new Error("No se encontró la materia seleccionada.");
    }

    const nextSubjects = subjects.map((subject) =>
      subject.id === subjectId
        ? {
            ...subject,
            topics: [
              ...subject.topics,
              { id: createId(), name: name.trim(), cards: [] },
            ],
          }
        : subject,
    );
    await saveSubjects(nextSubjects);
  }

  async function updateTopicCards(
    subjectId: string,
    topicId: string,
    updateCards: (cards: Flashcard[]) => Flashcard[],
  ) {
    const subject = subjects.find((item) => item.id === subjectId);
    if (!subject) {
      throw new Error("No se encontró la materia seleccionada.");
    }
    if (!subject.topics.some((topic) => topic.id === topicId)) {
      throw new Error("No se encontró el tema seleccionado.");
    }

    const nextSubjects = subjects.map((item) =>
      item.id === subjectId
        ? {
            ...item,
            topics: item.topics.map((topic) =>
              topic.id === topicId
                ? { ...topic, cards: updateCards(topic.cards) }
                : topic,
            ),
          }
        : item,
    );
    await saveSubjects(nextSubjects);
  }

  async function addFlashcard(
    subjectId: string,
    topicId: string,
    question: string,
    answer: string,
  ) {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    if (!trimmedQuestion || !trimmedAnswer) {
      throw new Error("Escribe una pregunta y una respuesta.");
    }

    await updateTopicCards(subjectId, topicId, (cards) => [
      ...cards,
      {
        id: createId(),
        question: trimmedQuestion,
        answer: trimmedAnswer,
        nextReviewDate: null,
      },
    ]);
  }

  async function updateFlashcard(
    subjectId: string,
    topicId: string,
    cardId: string,
    question: string,
    answer: string,
  ) {
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    if (!trimmedQuestion || !trimmedAnswer) {
      throw new Error("Escribe una pregunta y una respuesta.");
    }

    await updateTopicCards(subjectId, topicId, (cards) => {
      if (!cards.some((card) => card.id === cardId)) {
        throw new Error("No se encontró la tarjeta seleccionada.");
      }
      return cards.map((card) =>
        card.id === cardId
          ? { ...card, question: trimmedQuestion, answer: trimmedAnswer }
          : card,
      );
    });
  }

  async function deleteFlashcard(
    subjectId: string,
    topicId: string,
    cardId: string,
  ) {
    await updateTopicCards(subjectId, topicId, (cards) => {
      if (!cards.some((card) => card.id === cardId)) {
        throw new Error("No se encontró la tarjeta seleccionada.");
      }
      return cards.filter((card) => card.id !== cardId);
    });
  }

  async function reviewFlashcard(
    subjectId: string,
    topicId: string,
    cardId: string,
    rating: RecallRating,
  ) {
    await updateTopicCards(subjectId, topicId, (cards) => {
      if (!cards.some((card) => card.id === cardId)) {
        throw new Error("No se encontró la tarjeta seleccionada.");
      }
      return cards.map((card) =>
        card.id === cardId
          ? { ...card, nextReviewDate: calculateNextReviewDate(rating) }
          : card,
      );
    });
  }

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        isLoading,
        loadError,
        addSubject,
        addTopic,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        reviewFlashcard,
      }}
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
