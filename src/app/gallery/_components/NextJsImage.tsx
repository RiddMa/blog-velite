import Image from "next/image";
import type { RenderPhotoProps, Photo } from "react-photo-album";

export default function NextJsImage({
  photo,
  // imageProps: { alt, title, sizes, className, onClick,...imageProps },
  imageProps,
  wrapperStyle,
}: RenderPhotoProps) {
  console.log("photo", photo);
  console.log("imageProps", imageProps);
  console.log("wrapperStyle", wrapperStyle);
  return (
    <div style={{ ...wrapperStyle, position: "relative" }}>
      <Image
        fill
        src={photo}
        alt={""}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        blurDataURL={"blurDataURL" in photo ? (photo.blurDataURL as string) : undefined}
        quality={50}
      />
    </div>
  );
}
