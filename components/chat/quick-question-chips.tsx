"use client";

import { useLocale } from "@/components/i18n/locale-provider";

export function QuickQuestionChips({ onSelect }: { onSelect: (question: string) => void }) {
  const { t } = useLocale();
  const dict = t((d) => d.chat.quickQuestions);
  return <section className="quick-questions" aria-label="Suggested questions"><p>{dict.label}</p><div>{dict.questions.map((question) => <button key={question} type="button" onClick={() => onSelect(question)}>{question}</button>)}</div></section>;
}
