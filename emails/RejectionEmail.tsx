import EmailTemplate from "./EmailTemplate";

const RejectionEmail = ({ fullName }: { fullName: string }) => {
  const previewText = "An Update on Your BookWise Account Request";
  const header = "Regarding Your BookWise Account";
  const body = [
    `Hi ${fullName},`,
    "Thank you for your interest in BookWise and for taking the time to submit an account request.We regret to inform you that we are unable to approve your account because the university ID provided could not be verified.",
    "If you believe this was in error or have any questions, please feel free to contact our support team.",
  ];
  const buttonText = "Contact Support";
  const buttonUrl = "mailto:support@bookwise.com";
  const footer = "Regards,\nThe BookWise Team";

  return (
    <EmailTemplate
      previewText={previewText}
      header={header}
      body={body}
      buttonText={buttonText}
      buttonUrl={buttonUrl}
      footer={footer}
    />
  );
};

export default RejectionEmail;
