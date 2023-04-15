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
    img.crossOrigin = "anonymous"; // 設定跨域
    img.onload = () => {
      const canvasWidth = img.width;
      const canvasHeight = img.height;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      if (isBorderExist) {
        const border = new Image();
        border.crossOrigin = "anonymous"; // 設定跨域
        border.onload = () => {
          context.drawImage(border, 0, 0, canvasWidth, canvasHeight);
          const downloadLink = document.createElement("a");
          downloadLink.setAttribute("download", "photo.png");
          if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            // 如果是 iOS 系統，使用 toBlob 存入相簿
            canvas.toBlob((blob) => {
              const image = new Image();
              image.src = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = image.src;
              anchor.download = "photo.png";
              anchor.style.display = "none";
              document.body.appendChild(anchor);
              anchor.click();
              setTimeout(() => {
                document.body.removeChild(anchor);
                URL.revokeObjectURL(image.src);
              }, 1000);
            }, "image/png");
          } else {
            // 否則直接下載
            downloadLink.setAttribute(
              "href",
              canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
            );
            downloadLink.click();
          }
        };
        border.src = defaultBorder;
      } else {
        const downloadLink = document.createElement("a");
        downloadLink.setAttribute("download", "photo.png");
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
          canvas.toBlob((blob) => {
            const image = new Image();
            image.src = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = image.src;
            anchor.download = "photo.png";
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            anchor.click();
            setTimeout(() => {
              document.body.removeChild(anchor);
              URL.revokeObjectURL(image.src);
            }, 1000);
          }, "image/png");
        } else {
          downloadLink.setAttribute(
            "href",
            canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
          );
          downloadLink.click();
        }
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
