import EmailTemplate from "./EmailTemplate";

const InactiveMonthlyEmail = ({ fullName }: { fullName: string }) => {
  const previewText = "Don’t Forget to Check In at BookWise";
  const header = "Don’t Forget to Check In at BookWise";
  const body = [
    `Hi ${fullName},`,
    "We noticed you haven't checked in recently. Stay active and keep track of your borrowed books, due dates, and new arrivals.",
    "Log in now to stay on top of your reading:",
  ];
  const buttonText = "Log in to BookWise";
  const buttonUrl = "https://university-library-iota-ecru.vercel.app";
  const footer = "Keep the pages turning,\nThe BookWise Team";

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
export default InactiveMonthlyEmail;
