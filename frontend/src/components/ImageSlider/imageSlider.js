import { useState } from "react";

export default function ImageSlider(props) {
  const images = props.images;
  const [activeImage, setActiveImage] = useState(0);  

  return (
    <div className="w-full aspect-square flex items-center flex-col relative">
      <img src={images[activeImage]} className="w-full aspect-square object-cover" />
      <div className="absolute bottom-0 w-full h-[100px] backdrop-blur-lg">
        <div className="w-full h-full  flex items-center justify-center overflow-hidden">
          {images.map((image, index) => (
            <img
              onClick={() => setActiveImage(index)}
              key={index}
              src={image}
              className=" w-16 h-16 cursor-pointer  object-cover  mx-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
//testing
//testing 2