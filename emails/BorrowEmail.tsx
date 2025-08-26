import EmailTemplate from "./EmailTemplate";

const BorrowEmail = ({
  fullName,
  bookTitle,
  borrowDate,
  dueDate,
}: {
  fullName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
}) => {
  const previewText = "You've Borrowed a Book!";
  const header = "You've Borrowed a Book!";
  const body = [
    `Hi ${fullName},`,
    `You’ve successfully borrowed ${bookTitle}. Here are the details:
 • Borrowed On: ${borrowDate}\n • Due Date: ${dueDate}`,
    "Enjoy your reading, and don’t forget to return the book on time!",
  ];
  const buttonText = "View Borrowed Books";
  const buttonUrl =
    "https://university-library-iota-ecru.vercel.app/my-profile";
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
export default BorrowEmail;
