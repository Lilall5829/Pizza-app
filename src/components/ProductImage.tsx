"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
}

const FALLBACK_IMAGE =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

export default function ProductImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
  fill = false,
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src || FALLBACK_IMAGE);

  const handleError = () => {
    if (imageSrc !== FALLBACK_IMAGE) {
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  const imageProps = {
    src: imageSrc,
    alt,
    className: `${className}`,
    onError: handleError,
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return <Image {...imageProps} width={width} height={height} />;
}
