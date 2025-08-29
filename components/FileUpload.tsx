"use client";

import { IKImage, IKVideo, ImageKitProvider, IKUpload } from "imagekitio-next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(
      `${config.env.prodApiEndpoint}/api/auth/imagekit`,
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video" | "ID";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{ filePath: string | null }>({
    filePath: value ?? null,
  });
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.log(error);

    toast.error(`Your ${type} could not be uploaded. Please try again.`);
  };

  const onSuccess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast.success(`${res.filePath} uploaded successfully!`);
    setIsLoading(false);
  };

  const onValidate = (file: File) => {
    if (type === "ID") {
      if (file.size > 50 * 1024) {
        toast.error(`Please upload an image that is less than 50KB.`);
        return false;
      }
    } else if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`Please upload an image that is less than 20MB.`);
        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`Please upload a video that is less than 50MB.`);
        return false;
      }
    }
    return true;
  };

  const placeHolderLines = placeholder.split("\n");

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        className="hidden"
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => {
          setIsLoading(true);
          setProgress(0);
        }}
        onUploadProgress={({ loaded, total }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
      />

      <button
        className={cn("upload-btn py-2", styles.button)}
        onClick={(e) => {
          e.preventDefault();
          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
        disabled={isLoading}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <div className={cn("text-base", styles.placeholder)}>
          {isLoading ? (
            "Uploading..."
          ) : (
            <>
              {file && (
                <>
                  {progress === 0 ? (
                    <>
                      {placeHolderLines.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </>
                  ) : (
                    <p className={cn("upload-filename", styles.text)}>
                      {file.filePath}
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file &&
        (type === "image" || type === "ID" ? (
          <IKImage
            alt={file.filePath!}
            path={file.filePath!}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath!}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </ImageKitProvider>
  );
};
export default FileUpload;
