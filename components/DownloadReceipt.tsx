"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { CSSProperties, ReactNode, useState } from "react";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type LoaderType = "light" | "dark";
type ButtonVariantProps = VariantProps<typeof buttonVariants>;
type ButtonVariant = ButtonVariantProps["variant"];

const DownloadReceipt = ({
  id,
  className,
  style,
  variant,
  loaderType = "light",
  children,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
  variant?: ButtonVariant;
  loaderType?: LoaderType;
  children?: ReactNode;
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async () => {
    // 1. Set loading state to true
    setIsDownloading(true);

    try {
      // 2. Fetch the receipt file from your API
      const response = await fetch(`/api/receipts/${id}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // 3. Get the file data as a Blob (Binary Large Object)
      const blob = await response.blob();

      // 4. Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // 5. Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      // You can set a default filename here
      link.setAttribute("download", `BookWise-Receipt-${id}.pdf`);
      document.body.appendChild(link);

      // 6. Programmatically click the link to start the download
      link.click();

      // 7. Clean up by removing the link and revoking the URL
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Optionally, show an error message to the user
    } finally {
      // 8. Set loading state back to false after success or failure
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className={
        className
          ? cn(className, isDownloading && "flex items-center justify-center")
          : "book-btn"
      }
      variant={variant}
      style={style}
    >
      {children ? (
        isDownloading ? (
          <img
            src={
              "/icons/admin/" +
              (loaderType === "light" ? "loader.svg" : "loader-dark.svg")
            }
            className="size-5 animate-spin"
          />
        ) : (
          children
        )
      ) : (
        <p className="font-bebas-neue text-xl text-dark-100">
          {isDownloading ? "DOWNLOADING..." : "DOWNLOAD RECEIPT"}
        </p>
      )}
    </Button>
  );
};

export default DownloadReceipt;
