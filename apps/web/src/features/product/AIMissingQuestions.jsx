"use client";

import Link from "next/link";

export default function AIMissingQuestions({ draft, updateDraft }) {
  const questions = draft.aiAnalysis.questions;
  const answers = draft.aiAnalysis.answers;
  const skipped = draft.aiAnalysis.skippedQuestionIds;

  const updateAnswer = (question, value) => {
    const summaryField = {
      category: "category",
      colours: "colors",
      colors: "colors",
      craft_type: "craftType",
      craftType: "craftType",
      description: "description",
      effort: "effort",
      materials: "material",
      title: "title",
    }[question.field];
    updateDraft({
      aiAnalysis: {
        ...draft.aiAnalysis,
        answers: { ...answers, [question.id]: value },
        skippedQuestionIds: skipped.filter(
          (questionId) => questionId !== question.id,
        ),
      },
      ...(summaryField ? { summary: { [summaryField]: value } } : {}),
    });
  };

  const skip = (id) => {
    updateDraft({
      aiAnalysis: {
        ...draft.aiAnalysis,
        answers: { ...answers, [id]: "" },
        skippedQuestionIds: [...new Set([...skipped, id])],
      },
    });
  };

  return (
    <div className="min-h-full bg-surface-container-lowest pb-20 font-body text-on-surface lg:pb-0">
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-outline-variant bg-surface/95 px-4 backdrop-blur-md lg:px-12">
        <Link aria-label="Back to summary" className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-container" href="/artisan/products/new/summary">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="font-title text-[15px] font-semibold">Complete product details</span>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8 lg:py-10">
        <section className="rounded-xl border border-outline-variant bg-surface p-5">
          <span className="font-label text-[11px] font-semibold uppercase tracking-wider text-warning">AI found {questions.length} missing detail{questions.length === 1 ? "" : "s"}</span>
          <h1 className="mt-1 font-headline text-[22px] font-bold text-primary">A few simple questions</h1>
          <p className="mt-1 text-[13px] text-secondary">Answer what you know. Optional questions can be skipped, and all answers stay editable.</p>
        </section>
        <section className="mt-4 space-y-4">
          {questions.map((question, index) => (
            <article className="rounded-xl border border-outline-variant bg-surface p-4" key={question.id}>
              <label className="font-title text-[15px] font-semibold text-primary" htmlFor={`ai-answer-${question.id}`}>
                {index + 1}. {question.question}
              </label>
              <textarea className="mt-3 min-h-[84px] w-full resize-y rounded-lg border border-outline px-3 py-2 text-[14px] outline-none focus:border-primary" id={`ai-answer-${question.id}`} onChange={(event) => updateAnswer(question, event.target.value)} placeholder="Type your answer" value={answers[question.id] ?? ""} />
              {question.skippable && (
                <button className="mt-2 text-[12px] font-semibold text-secondary hover:text-primary" onClick={() => skip(question.id)} type="button">
                  {skipped.includes(question.id) ? "Skipped" : "Skip this question"}
                </button>
              )}
            </article>
          ))}
        </section>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="flex h-12 flex-1 items-center justify-center rounded-xl border border-outline bg-surface font-semibold text-primary" href="/artisan/products/new/summary">Back to summary</Link>
          <Link className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary font-semibold text-on-primary" href="/artisan/products/new/pricing">Continue to pricing</Link>
        </div>
      </main>
    </div>
  );
}
