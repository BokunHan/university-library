import EmailTemplate from "./EmailTemplate";

const ReturnEmail = ({
  fullName,
  bookTitle,
}: {
  fullName: string;
  bookTitle: string;
}) => {
  const previewText = `Thank You for Returning ${bookTitle}!`;
  const header = `Thank You for Returning ${bookTitle}!`;
  const body = [
    `Hi ${fullName},`,
    `We’ve successfully received your return of ${bookTitle}. Thank you for returning it on time.`,
    "Looking for your next read? Browse our collection and borrow your next favorite book!",
  ];
  const buttonText = "Explore New Books";
  const buttonUrl = "https://university-library-iota-ecru.vercel.app";
  const footer = "Happy exploring,\nThe BookWise Team";

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
export default ReturnEmail;
