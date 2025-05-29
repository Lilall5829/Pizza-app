import Image from "next/image";
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type RemoteImageProps = {
  path?: string | null;
  fallback: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
};

const RemoteImage = ({
  path,
  fallback,
  alt,
  width = 400,
  height = 300,
  className = "",
  fill = false,
  ...imageProps
}: RemoteImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!path) {
      setImageSrc(fallback);
      return;
    }

    const loadImage = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from("product-images")
          .download(path);

        if (error) {
          console.error("Error loading image:", error);
          setImageSrc(fallback);
          return;
        }

        if (data) {
          const url = URL.createObjectURL(data);
          setImageSrc(url);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImageSrc(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [path, fallback]);

  const handleError = () => {
    setImageSrc(fallback);
  };

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={`object-cover ${isLoading ? "opacity-50" : ""} ${className}`}
        onError={handleError}
        {...imageProps}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${isLoading ? "opacity-50" : ""} ${className}`}
      onError={handleError}
      {...imageProps}
    />
  );
};

export default RemoteImage;
