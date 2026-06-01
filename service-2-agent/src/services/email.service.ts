import { Resend } from "resend";
import { SequenceStep } from "./sequence.service";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (
  to: string,
  step: SequenceStep,
  company: string,
): Promise<void> => {
  if (step.channel !== "email") return;

  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: step.subject ?? `Following up — ${company}`,
    text: step.message,
  });

  if (error) {
    console.error(`❌ Email failed for ${company}:`, error.message);
  } else {
    console.log(`📧 Email sent to ${to} [Day ${step.day}] — ID: ${data?.id}`);
  }
};
