import React from "react";
import { Client as WorkflowClient } from "@upstash/workflow";
import config from "@/lib/config";
import { Client as QStashClient, resend } from "@upstash/qstash";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { render, pretty } from "@react-email/render";
import InactiveEmail from "@/emails/InactiveEmail";
import ApprovalEmail from "@/emails/ApprovalEmail";
import RejectionEmail from "@/emails/RejectionEmail";
import BorrowEmail from "@/emails/BorrowEmail";
import DueReminderEmail from "@/emails/DueReminderEmail";
import ReceiptReadyEmail from "@/emails/ReceiptReadyEmail";
import ReturnEmail from "@/emails/ReturnEmail";
import InactiveMonthlyEmail from "@/emails/InactiveMonthlyEmail";
import ActiveMonthlyEmail from "@/emails/ActiveMonthlyEmail";

type EmailType =
  | "welcome"
  | "approval"
  | "rejection"
  | "borrow"
  | "due"
  | "receipt-ready"
  | "return"
  | "inactive-3"
  | "inactive-30"
  | "active-30"
  | "receipt";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

export const sendEmail = async ({
  email,
  type,
  fullName,
  bookTitle,
  borrowDate,
  dueDate,
  recordId,
}: {
  email: string;
  type: EmailType;
  fullName: string;
  bookTitle?: string;
  borrowDate?: string;
  dueDate?: string;
  recordId?: string;
}) => {
  let subject: string;
  let component: React.ReactNode;

  switch (type) {
    case "welcome":
      subject = `Welcome to BookWise, ${fullName}!`;
      component = <WelcomeEmail fullName={fullName} />;
      break;

    case "inactive-3":
      subject = `We Miss You at BookWise, ${fullName}!`;
      component = <InactiveEmail fullName={fullName} />;
      break;

    case "inactive-30":
      subject = `Don&apos;t Forget to Check In at BookWise, ${fullName}!`;
      component = <InactiveMonthlyEmail fullName={fullName} />;
      break;

    case "active-30":
      subject = `Congratulations on Reaching a New Milestone, ${fullName}!`;
      component = <ActiveMonthlyEmail fullName={fullName} />;
      break;

    case "approval":
      subject = `Your BookWise Account Has Been Approved, ${fullName}!`;
      component = <ApprovalEmail fullName={fullName} />;
      break;

    case "rejection":
      subject = `An Update on Your BookWise Account Request, ${fullName}!`;
      component = <RejectionEmail fullName={fullName} />;
      break;

    case "borrow":
      subject = `You&apos;ve Borrowed a Book, ${fullName}!`;
      component = (
        <BorrowEmail
          fullName={fullName}
          bookTitle={bookTitle!}
          borrowDate={borrowDate!}
          dueDate={dueDate!}
        />
      );
      break;

    case "receipt-ready":
      subject = `Your Receipt for ${bookTitle} is Ready, ${fullName}!`;
      component = (
        <ReceiptReadyEmail
          fullName={fullName}
          bookTitle={bookTitle!}
          borrowDate={borrowDate!}
          dueDate={dueDate!}
          recordId={recordId!}
        />
      );
      break;

    case "due":
      subject = `Reminder: ${bookTitle} is Due Soon, ${fullName}!`;
      component = (
        <DueReminderEmail
          fullName={fullName}
          bookTitle={bookTitle!}
          dueDate={dueDate!}
        />
      );
      break;

    case "return":
      subject = `Thank You for Returning ${bookTitle}, ${fullName}!`;
      component = <ReturnEmail fullName={fullName} bookTitle={bookTitle!} />;
      break;

    default:
      console.error(`Unknown email type provided: ${type}`);
      throw new Error(`Unknown email type: ${type}`);
  }
  const html = await pretty(await render(component));

  await qstashClient.publishJSON({
    api: {
      name: "email",
      provider: resend({ token: config.env.resendToken }),
    },
    body: {
      from: "Bokun Han <hello@bokun.pro>",
      to: [email],
      subject,
      html: html,
    },
  });
};
