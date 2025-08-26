import EmailTemplate from "./EmailTemplate";

const ActiveMonthlyEmail = ({ fullName }: { fullName: string }) => {
  const previewText = "Congratulations on Reaching a New Milestone!";
  const header = "Congratulations on Reaching a New Milestone!";
  const body = [
    `Hi ${fullName},`,
    "Great news! You’ve reached a new milestone in your reading journey with BookWise. 🎉 Whether it’s finishing a challenging book, staying consistent with your reading goals, or exploring new genres, your dedication inspires us.",
    "Keep the momentum going—there are more exciting books and features waiting for you!",
    "Log in now to discover your next adventure:",
  ];
  const buttonText = "Discover New Reads";
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
export default ActiveMonthlyEmail;
