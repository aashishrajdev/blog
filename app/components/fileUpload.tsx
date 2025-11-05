"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";

interface FileUploadResponse {
  url?: string;
  fileId?: string;
  name?: string;
  size?: number;
  filePath?: string;
  thumbnailUrl?: string;
}

interface FileUploadProps {
  onSuccess: (res: FileUploadResponse) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (fileType == "video") {
      if (!file.type.startsWith("video/")) {
        setError("Invalid file type...! Please upload a video file.");
        setSuccess(null);
        return false;
      }
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds 100MB limit. Please upload a smaller file.");
      setSuccess(null);
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !validateFile(file)) {
      setSelectedFile(null);
      setSuccess(null);
      return;
    }
    setSelectedFile(file);
    setError(null);
    setSuccess(null);
    setProgress(0);
    // Auto-start upload to reduce extra click
    void handleUpload(file);
  };

  const handleUpload = async (fileArg?: File) => {
    const fileToUpload = fileArg ?? selectedFile;
    if (!fileToUpload) return;
    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);
    try {
      const authRes = await fetch("/api/imageKit-auth");
      const auth = await authRes.json();
      const res = await upload({
        file: fileToUpload,
        fileName: fileToUpload.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        // Progress callback to update upload progress state
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setProgress(Math.round(percent));
            onProgress?.(Math.round(percent));
          }
        },
      });
      onSuccess(res);
      setSuccess("Upload successful!");
      setSelectedFile(null);
    } catch (error) {
      setError("Upload failed. Please try again.");
      setSuccess(null);
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // const [progress, setProgress] = useState(0);
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const abortController = new AbortController();

  // const authenticator = async () => {
  //     try {

  //         const response = await fetch("/api/upload-auth");
  //         if (!response.ok) {
  //             const errorText = await response.text();
  //             throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  //         }
  //         const data = await response.json();
  //         const { signature, expire, token, publicKey } = data;
  //         return { signature, expire, token, publicKey };
  //     } catch (error) {
  //         console.error("Authentication error:", error);
  //         throw new Error("Authentication request failed");
  //     }
  // };
  // const handleUpload = async () => {
  //     const fileInput = fileInputRef.current;
  //     if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
  //         alert("Please select a file to upload");
  //         return;
  //     }

  //     const file = fileInput.files[0];

  //     let authParams;
  //     try {
  //         authParams = await authenticator();
  //     } catch (authError) {
  //         console.error("Failed to authenticate for upload:", authError);
  //         return;
  //     }
  //     const { signature, expire, token, publicKey } = authParams;
  //     try {
  //         const uploadResponse = await upload({
  //             expire,
  //             token,
  //             signature,
  //             publicKey,
  //             file,
  //             fileName: file.name,
  //             onProgress: (event) => {
  //                 setProgress((event.loaded / event.total) * 100);
  //             },
  //             abortSignal: abortController.signal,
  //         });
  //         console.log("Upload response:", uploadResponse);
  //     } catch (error) {
  //         if (error instanceof ImageKitAbortError) {
  //             console.error("Upload aborted:", error.reason);
  //         } else if (error instanceof ImageKitInvalidRequestError) {
  //             console.error("Invalid request:", error.message);
  //         } else if (error instanceof ImageKitUploadNetworkError) {
  //             console.error("Network error:", error.message);
  //         } else if (error instanceof ImageKitServerError) {
  //             console.error("Server error:", error.message);
  //         } else {
  //             console.error("Upload error:", error);
  //         }
  //     }
  // };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg p-5 mt-2">
      <input
        id="file-upload-input"
        type="file"
        aria-label="File upload"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      <label
        htmlFor="file-upload-input"
        className={`inline-block px-4 py-3 rounded-md font-semibold text-sm ${
          uploading
            ? "bg-blue-500/60 text-white cursor-not-allowed"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
        }`}
      >
        {uploading ? "Uploading..." : "📁 Choose Image"}
      </label>

      {selectedFile && !uploading && (
        <div className="mt-3 text-green-600 text-sm p-2 rounded-md bg-green-50 border border-green-100 font-medium">
          ✓ Selected: <strong>{selectedFile.name}</strong>
        </div>
      )}

      {uploading && (
        <div className="mt-3 p-3 rounded-md bg-white/60">
          <div className="text-blue-600 text-sm mb-2 font-semibold">
            ⚡ Uploading... {progress}%
          </div>
          <progress
            value={progress}
            max={100}
            className="w-full h-2 rounded-full overflow-hidden appearance-none bg-blue-100"
          />
        </div>
      )}

      {error && (
        <div className="mt-3 text-red-600 text-sm p-3 rounded-md bg-red-50 border border-red-100 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 text-green-600 text-sm p-2 rounded-md bg-green-50">
          {success}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
