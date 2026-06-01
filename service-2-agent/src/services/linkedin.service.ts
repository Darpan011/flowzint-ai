import { SequenceStep } from "./sequence.service";

export const draftLinkedin = (step: SequenceStep, company: string): void => {
  if (step.channel !== "linkedin") return;

  console.log(`💼 [LINKEDIN DRAFT] Day ${step.day} — ${company}`);
  console.log(`   Message: ${step.message}`);
};
