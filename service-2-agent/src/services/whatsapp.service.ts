import { SequenceStep } from "./sequence.service";

export const draftWhatsapp = (step: SequenceStep, company: string): void => {
  if (step.channel !== "whatsapp") return;

  console.log(`💬 [WHATSAPP DRAFT] Day ${step.day} — ${company}`);
  console.log(`   Message: ${step.message}`);
};
