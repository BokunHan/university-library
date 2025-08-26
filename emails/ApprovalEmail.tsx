import EmailTemplate from "./EmailTemplate";

const ApprovalEmail = ({ fullName }: { fullName: string }) => {
  const previewText = "Your BookWise Account Has Been Approved!";
  const header = "Your BookWise Account Has Been Approved!";
  const body = [
    `Hi ${fullName},`,
    "Congratulations! Your BookWise account has been approved. You can now browse our library, borrow books, and enjoy all the features of your new account.",
    "Log in to get started:",
  ];
  const buttonText = "Log in to BookWise";
  const buttonUrl = "https://university-library-iota-ecru.vercel.app";
  const footer = "Welcome aboard,\nThe BookWise Team";

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
export default ApprovalEmail;
