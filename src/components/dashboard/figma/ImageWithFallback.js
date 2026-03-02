import React from "react";

export const ImageWithFallback = ({ src, alt, className }) => {
  return <img src={src} alt={alt} className={className} />;
};