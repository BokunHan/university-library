import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

type UserState = "non-active" | "active";
type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAY_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAY_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();
  if (timeDifference > THREE_DAY_IN_MS && timeDifference < THIRTY_DAY_IN_MS) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  // Welcome Email
  await context.run("new-signup", async () => {
    await sendEmail({
      email,
      type: "welcome",
      fullName,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  let state = await context.run("check-user-state", async () => {
    return await getUserState(email);
  });

  if (state === "non-active") {
    await context.run("send-email-non-active", async () => {
      await sendEmail({
        email,
        type: "inactive-3",
        fullName,
      });
    });
  }

  await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);

  while (true) {
    state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active-monthly", async () => {
        await sendEmail({
          email,
          type: "inactive-30",
          fullName,
        });
      });
    } else {
      await context.run("send-email-active-monthly", async () => {
        await sendEmail({
          email,
          type: "active-30",
          fullName,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
