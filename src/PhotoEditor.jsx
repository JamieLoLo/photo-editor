import { useState, useRef } from "react";
import defaultBorder from "./defaultBorder.png";

const PhotoEditor = () => {
  const [uploadPhotoUrl, setUploadPhotoUrl] = useState();
  const [isBorderExist, setIsBorderExit] = useState(false);
  const canvasRef = useRef();

  const handleUploadPhoto = (e) => {
    if (e.target.files[0]) {
      setUploadPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleBorderDisplay = () => {
    setIsBorderExit(!isBorderExist);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      const canvasWidth = img.width;
      const canvasHeight = img.height;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      if (isBorderExist) {
        const border = new Image();
        border.onload = () => {
          context.drawImage(border, 0, 0, canvasWidth, canvasHeight);
          const downloadLink = document.createElement("a");
          downloadLink.setAttribute("download", "photo.png");
          downloadLink.setAttribute(
            "href",
            canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
          );
          downloadLink.click();
        };
        border.src = defaultBorder;
      } else {
        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", "photo.png");
        downloadLink.setAttribute(
          "href",
          canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        );
        downloadLink.click();
      }
    };
    img.src = uploadPhotoUrl;
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-start items-center mt-4">
      <div className="w-[380px] h-[380px] border-4 grey-red-400 relative">
        <img src={uploadPhotoUrl} className="w-full h-full object-cover" />
        <img src={isBorderExist && defaultBorder} className="absolute inset-0" />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <label
        htmlFor="uploadPhoto"
        className="bg-green-600 px-8 py-2 rounded mt-4 text-white cursor-pointer"
      >
        上傳照片
      </label>
      <input type="file" id="uploadPhoto" className="hidden" onChange={handleUploadPhoto} />
      <button className="bg-red-600 px-8 py-2 rounded mt-4 text-white" onClick={handleBorderDisplay}>
        {isBorderExist ? "取消邊框" : "加上邊框"}
      </button>
      <button className="bg-blue-600 px-8 py-2 rounded mt-4 text-white" onClick={handleDownload}>
        下載照片
      </button>
    </div>
  );
};

export default PhotoEditor;
