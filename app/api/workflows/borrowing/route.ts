import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

type BorrowState = "need-reminder" | "is-due";
type InitialData = {
  recordId: string;
  email: string;
  fullName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
};

const FIVE_DAY_IN_MS = 5 * 24 * 60 * 60 * 1000;
const SEVEN_DAY_IN_MS = 7 * 24 * 60 * 60 * 1000;

const getBorrowState = async (recordId: string): Promise<BorrowState> => {
  const record = await db
    .select()
    .from(borrowRecords)
    .where(eq(borrowRecords.id, recordId))
    .limit(1);

  if (record.length === 0) throw new Error("Borrow record not found");

  const borrowDate = new Date(record[0].borrowDate!);
  const dueDate = new Date(record[0].dueDate!);
  const timeDifference = dueDate.getTime() - borrowDate.getTime();
  if (timeDifference > FIVE_DAY_IN_MS && timeDifference < SEVEN_DAY_IN_MS) {
    return "need-reminder";
  }

  return "is-due";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { recordId, email, fullName, bookTitle, borrowDate, dueDate } =
    context.requestPayload;

  await context.run("borrow-book", async () => {
    console.log("Triggered Borrow Book Workflow");
    await sendEmail({
      email,
      type: "borrow",
      fullName,
      bookTitle,
      borrowDate,
      dueDate,
    });
  });

  await context.run("receipt-ready", async () => {
    await sendEmail({
      email,
      type: "receipt-ready",
      fullName,
      bookTitle,
      borrowDate,
      dueDate,
      recordId,
    });
  });

  await context.sleep("wait-for-5-days", 60 * 60 * 24 * 5);

  while (true) {
    const state = await context.run("check-borrow-state", async () => {
      return await getBorrowState(recordId);
    });

    if (state === "need-reminder") {
      await context.run("send-email-due-reminder", async () => {
        await sendEmail({
          email,
          type: "due",
          fullName,
          bookTitle,
          borrowDate,
          dueDate,
        });
      });
    }

    await context.sleep("wait-for-1-day", 60 * 60 * 24);
  }
});
