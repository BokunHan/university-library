import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { ReceiptTemplate } from "@/components/ReceiptTemplate";
import dayjs from "dayjs";
import { promises as fs } from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import puppeteerFull from "puppeteer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recordId: string }> },
) {
  const { recordId } = await params;
  const ReactDOMServer = (await import("react-dom/server")).default;

  if (!recordId) {
    return new NextResponse("Borrow record ID is required", { status: 400 });
  }

  try {
    // 1. Fetch data from the database using a JOIN
    const [record] = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        title: books.title,
        author: books.author,
        genre: books.genre,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.id, recordId));

    if (!record) {
      return new NextResponse("Receipt not found", { status: 404 });
    }

    const cssFilePath = path.resolve(
      process.cwd(),
      "styles/receipt-styles.css",
    );
    const css = await fs.readFile(cssFilePath, "utf-8");

    // 2. Render the React component to an HTML string
    const html = ReactDOMServer.renderToStaticMarkup(
      <ReceiptTemplate
        recordId={record.id}
        title={record.title}
        author={record.author}
        genre={record.genre}
        borrowDate={dayjs(record.borrowDate).format("MMMM D, YYYY")}
        dueDate={dayjs(record.dueDate).format("MMMM D, YYYY")}
        css={css}
      />,
    );

    // 3. Generate PDF using Puppeteer
    let browser;
    if (process.env.NODE_ENV === "production") {
      // Use the serverless-compatible Chromium in production (Vercel)
      browser = await puppeteer.launch({
        args: [...chromium.args, "--single-process"],
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      // Use the default Puppeteer behavior in development
      // This will automatically find the locally installed Chromium
      browser = await puppeteer.launch({
        executablePath: puppeteerFull.executablePath(),
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // 4. Send the PDF as the response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="BookWise-Receipt-${recordId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[RECEIPT_GENERATION_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
