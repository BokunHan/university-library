import config from "@/lib/config";

interface ReceiptProps {
  recordId: string;
  title: string;
  author: string;
  genre: string;
  borrowDate: string;
  dueDate: string;
  css: string;
}

const baseUrl = config.env.imagekit.urlEndpoint;

// A simple, clean receipt component with inline styles for PDF compatibility
export const ReceiptTemplate = ({
  recordId,
  title,
  author,
  genre,
  borrowDate,
  dueDate,
  css,
}: ReceiptProps) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>BookWise Receipt</title>
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </head>
    <body className="bg-primary-emailBG my-auto mx-auto font-ibm-plex-sans">
      <div className="flex flex-col gap-10 m-8 p-12 rounded-xl bg-dark-300 relative z-10">
        <div className="flex justify-start gap-2">
          <img
            src={`${baseUrl}/icons/logo.png`}
            alt="logo"
            width={40}
            height={32}
          />
          <p className="text-[28px] text-white font-semibold">BookWise</p>
        </div>

        <div className="flex flex-col justify-start gap-3 pb-8 border-b border-light-100/10">
          <p className="text-2xl text-white font-bold">Borrow Receipt</p>
          <div className="flex flex-row gap-2">
            <p className="text-base text-light-700">Receipt ID:</p>
            <p className="text-base font-bold text-light-200">{recordId}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="text-base text-light-700">Date Issued:</p>
            <p className="text-base font-bold text-light-200">{borrowDate}</p>
          </div>
        </div>

        <div className="flex flex-col justify-start gap-3 pb-8 mb-2 border-b border-light-100/10">
          <p className="text-2xl text-white font-bold mb-2">Book Details:</p>
          <div className="flex flex-row gap-2 pl-2">
            <p className="text-base text-light-700">• Title:</p>
            <p className="text-base text-white font-bold line-clamp-1">
              {title}
            </p>
          </div>
          <div className="flex flex-row gap-2 pl-2">
            <p className="text-base text-light-700">• Author:</p>
            <p className="text-base text-white font-bold">{author}</p>
          </div>
          <div className="flex flex-row gap-2 pl-2">
            <p className="text-base text-light-700">• Genre:</p>
            <p className="text-base text-white font-bold">{genre}</p>
          </div>
          <div className="flex flex-row gap-2 pl-2">
            <p className="text-base text-light-700">• Borrowed On:</p>
            <p className="text-base text-white font-bold">{borrowDate}</p>
          </div>
          <div className="flex flex-row gap-2 pl-2">
            <p className="text-base text-light-700">• Due Date:</p>
            <p className="text-base text-white font-bold">{dueDate}</p>
          </div>
          <div className="flex flex-row gap-2 pl-2">
            <p className="text-base text-light-700">• Duration:</p>
            <p className="text-base text-white font-bold">7 Days</p>
          </div>
        </div>

        <div className="flex flex-col justify-start gap-2 pb-8 mb-2 border-b border-light-100/10">
          <p className="text-2xl text-white font-bold mb-2">Terms</p>
          <p className="text-base text-light-700 pl-2">
            • Please return the book by the due date.
          </p>
          <p className="text-base text-light-700 pl-2">
            • Lost or damaged books may incur replacement costs.
          </p>
        </div>

        <div className="flex flex-col justify-start gap-1 mb-8">
          <p className="text-base text-light-700">
            Thank you for using <strong>BookWise</strong>!
          </p>
          <p className="text-base text-light-700">
            Website: <strong>bookwise.com</strong>
          </p>
          <p className="text-base text-light-700">
            Email: <strong>support@bookwise.com</strong>
          </p>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          aspectRatio: "544/554",
          backgroundImage: `url('${baseUrl}/icons/receiptBG.svg')`,
          backgroundSize: "contain",
          backgroundOrigin: "content-box",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "31px",
          position: "absolute",
          top: "300px",
          left: "0px",
          zIndex: "0",
        }}
      />
    </body>
  </html>
);
