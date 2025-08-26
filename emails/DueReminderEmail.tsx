import EmailTemplate from "./EmailTemplate";

const DueReminderEmail = ({
  fullName,
  bookTitle,
  dueDate,
}: {
  fullName: string;
  bookTitle: string;
  dueDate: string;
}) => {
  const previewText = `Reminder: ${bookTitle} is Due Soon!`;
  const header = `Reminder: ${bookTitle} is Due Soon!`;
  const body = [
    `Hi ${fullName},`,
    `Just a reminder that ${bookTitle} is due for return on ${dueDate}. Kindly return it on time to avoid late fees.`,
    "If you’re still reading, you can renew the book in your account.",
  ];
  const buttonText = "Renew Book Now";
  const buttonUrl =
    "https://university-library-iota-ecru.vercel.app/my-profile";
  const footer = "Keep reading,\nThe BookWise Team";

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
export default DueReminderEmail;
