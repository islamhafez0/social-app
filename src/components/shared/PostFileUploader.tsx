import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Button } from "../ui/button";
import { FileUploaderProps } from "@/types";

const PostFileUploader = ({
  handleFileChange,
  mediaUrl,
}: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      handleFileChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      console.log(file);
    },
    [handleFileChange]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".svg", ".jpeg", ".jpg", ".png"] },
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center p-5 lg:p-10">
            <img src={fileUrl} alt="post-image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            width={96}
            height={77}
            src="/assets/icons/file-upload.svg"
            alt="upload file"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="small-regular text-light-4 mb-2">SVG, PNG, JPG</p>
          <Button className="shad-button_dark_4">Select Image</Button>
        </div>
      )}
    </div>
  );
};

export default PostFileUploader;
