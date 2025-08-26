import EmailTemplate from "./EmailTemplate";

const ReceiptReadyEmail = ({
  fullName,
  bookTitle,
  borrowDate,
  dueDate,
  recordId,
}: {
  fullName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  recordId: string;
}) => {
  const previewText = `Your Receipt for ${bookTitle} is Ready!`;
  const header = `Your Receipt for ${bookTitle} is Ready!`;
  const body = [
    `Hi ${fullName},`,
    `Your receipt for borrowing ${bookTitle} has been generated. Here are the details:
 • Borrowed On: ${borrowDate}\n • Due Date: ${dueDate}`,
    "You can download the receipt here:",
  ];
  const buttonText = "Download Receipt";
  const buttonUrl = `https://university-library-iota-ecru.vercel.app/api/receipts/${recordId}`;
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
export default ReceiptReadyEmail;
