import React, { useState } from "react";
import mediaUpload from "../../utils/mediaUpload";

function Test() {
  const [file, setFile] = useState(null);

  function uploadFile() {
    console.log(file);
    mediaUpload(file).then((url) => {
      console.log(url);
    });
  }
  return (
    <div className="w-full flex flex-col justify-center items-center h-screen">
      <input
        type="file"
        multiple
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button
        onClick={uploadFile}
        className="w-[200px] h-[50px] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-shadow"
      >
        upload
      </button>
    </div>
  );
}

export default Test;
