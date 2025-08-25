import React from "react";
import { Client as WorkflowClient } from "@upstash/workflow";
import config from "@/lib/config";
import { Client as QStashClient, resend } from "@upstash/qstash";
import { EmailType } from "@/app/api/workflows/onboarding/route";
import WelcomeEmail from "@/emails/WelcomeEmail";
import { render } from "@react-email/components";

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
}: {
  email: string;
  type: EmailType;
  fullName: string;
}) => {
  let subject: string;
  let component: React.ReactElement;

  switch (type) {
    case "welcome":
      subject = `Welcome to BookWise, ${fullName}!`;
      component = <WelcomeEmail fullName={fullName} />;
      break;

    default:
      console.error(`Unknown email type provided: ${type}`);
      throw new Error(`Unknown email type: ${type}`);
  }
  const html = render(component);

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
