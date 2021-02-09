import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

type Props = {
  appearances: string[];
};

const AppearancesGallery: React.FC<Props> = React.memo((props) => {
  const images: {
    original: string;
    thumbnail: string;
  }[] = [];

  if (props.appearances.length > 0) {
    for (const ele of props.appearances) {
      images.push({ original: ele, thumbnail: ele });
    }
  }

  return <ImageGallery items={images} />;
});

export default AppearancesGallery;
