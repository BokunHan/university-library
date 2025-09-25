"use client";

import React from "react";
import { cn } from "@/lib/utils";
import BookCoverSvg from "@/components/BookCoverSvg";
import Image from "next/image";
import config from "@/lib/config";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverUrl: string;
  isBlurred?: boolean;
  priority?: boolean;
}

const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverUrl = "https://placehold.co/400x600.png",
  isBlurred = false,
  priority = false,
}: Props) => {
  let sizes = "(min-width: 480px) 174px, 114px";
  switch (variant) {
    case "extraSmall":
      sizes = "28.95px";
      break;
    case "small":
      sizes = "55px";
      break;
    case "medium":
      sizes = "144px";
      break;
    case "wide":
      sizes = "(min-width: 480px) 296px, 256px";
  }

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className,
      )}
    >
      <BookCoverSvg coverColor={coverColor} isBlurred={isBlurred} />

      <div
        className="absolute"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        {/*<IKImage*/}
        {/*  path={coverUrl}*/}
        {/*  urlEndpoint={config.env.imagekit.urlEndpoint}*/}
        {/*  alt="Book cover"*/}
        {/*  fill*/}
        {/*  className={cn("rounded-sm object-fill", isBlurred && "blur-sm")}*/}
        {/*  //loading={priority ? "eager" : "lazy"}*/}
        {/*  priority={priority}*/}
        {/*  transformation={transformation}*/}
        {/*  lqip={{ active: true }}*/}
        {/*/>*/}
        <Image
          src={config.env.imagekit.urlEndpoint + coverUrl}
          alt="Book cover"
          fill
          sizes={sizes}
          className={cn("rounded-sm object-cover", isBlurred && "blur-sm")}
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
    </div>
  );
};
export default BookCover;
