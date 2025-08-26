import EmailTemplate from "./EmailTemplate";

const InactiveEmail = ({ fullName }: { fullName: string }) => {
  const previewText = "We Miss You at BookWise!";
  const header = "We Miss You at BookWise!";
  const body = [
    `Hi ${fullName},`,
    "It’s been a while since we last saw you—over three days, to be exact! New books are waiting for you, and your next great read might just be a click away.",
    "Come back and explore now:",
  ];
  const buttonText = "Explore Books on BookWise";
  const buttonUrl = "https://university-library-iota-ecru.vercel.app";
  const footer = "See you soon,\nThe BookWise Team";

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
export default InactiveEmail;
