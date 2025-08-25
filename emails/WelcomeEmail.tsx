import EmailTemplate from "./EmailTemplate";

const WelcomeEmail = ({ fullName }: { fullName: string }) => {
  const previewText = "Welcome to BookWise!";
  const header = "Welcome to BookWise, Your Reading Companion!";
  const body = [
    `Hi ${fullName},`,
    "Welcome to BookWise! We're excited to have you join our community of book enthusiasts. Explore a wide range of books, borrow with ease, and manage your reading journey seamlessly.",
    "Get started by logging in to your account:",
  ];
  const buttonText = "Login to BookWise";
  const buttonUrl = "https://university-library-iota-ecru.vercel.app";
  const footer = "Happy reading,\nThe BookWise Team";

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
export default WelcomeEmail;
