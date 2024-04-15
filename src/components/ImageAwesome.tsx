import Image from "next/image";
import React from "react";
import isUrl from "is-url";

export function ImageAwesome({ src, alt, width, height, className, blurDataURL, halo = true }: {
  src: string,
  alt: string,
  width?: number,
  height?: number,
  className?: string,
  blurDataURL?: string,
  halo?: boolean
}) {
  if (isUrl(src)) {
    return <span className={`relative ${className}`}>
    {halo && <img aria-hidden={true} src={src} alt={alt}
                  className="mx-auto card absolute blur-3xl brightness-150 contrast-[0.8] saturate-200 opacity-50 dark:opacity-30"
                  style={{ width: "100%", height: "auto" }} />
    }
      <img src={src} alt={alt} className="mx-auto card relative" style={{ width: "100%", height: "auto" }} />
  </span>;
  } else if (width && height) {
    return <span className={`relative ${className}`}>
      {halo && <Image aria-hidden={true} src={src} alt={alt}
                      className="mx-auto top-0 right-0 bottom-0 left-0 card absolute blur-3xl brightness-150 contrast-[0.8] saturate-200 opacity-50 dark:opacity-30"
                      width={width} height={height} sizes="100vw" />
      }
      <Image src={src} alt={alt} className="card relative mx-auto" width={width} height={height} sizes="100vw"
             blurDataURL={blurDataURL} />
    </span>;

  } else {
    return <span className={`relative ${className}`}>
      {halo && <Image aria-hidden={true} src={src} alt={alt}
                      className="mx-auto card absolute blur-3xl brightness-150 contrast-[0.8] saturate-200 opacity-50 dark:opacity-30"
                      width={0} height={0} sizes="100vw" style={{ width: "100%", height: "auto" }} />
      }
      <Image src={src} alt={alt} className="mx-auto card relative" width={0} height={0} sizes="100vw"
             style={{ width: "100%", height: "auto" }} />
    </span>;
  }
}
