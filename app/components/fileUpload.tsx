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
    <div
      className="glass-effect"
      style={{
        marginTop: 8,
        padding: 20,
        borderRadius: 12,
      }}
    >
      <input
        id="file-upload-input"
        type="file"
        aria-label="File upload"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: "none" }}
      />
      <label
        htmlFor="file-upload-input"
        className={uploading ? "" : "glass-button"}
        style={{
          display: "inline-block",
          padding: "12px 24px",
          background: uploading
            ? "rgba(0, 112, 243, 0.5)"
            : "rgba(0, 112, 243, 0.15)",
          color: "#0070f3",
          border: "1px solid rgba(0, 112, 243, 0.3)",
          borderRadius: 8,
          cursor: uploading ? "not-allowed" : "pointer",
          fontWeight: 600,
          fontSize: 14,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow:
            "0 4px 12px rgba(0, 112, 243, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
        }}
      >
        {uploading ? "Uploading..." : "📁 Choose Image"}
      </label>
      {selectedFile && !uploading && (
        <div
          className="glass-effect"
          style={{
            marginTop: 12,
            color: "#27ae60",
            fontSize: 14,
            padding: 10,
            borderRadius: 8,
            background: "rgba(39, 174, 96, 0.1)",
            border: "1px solid rgba(39, 174, 96, 0.2)",
          }}
        >
          ✓ Selected: <strong>{selectedFile.name}</strong>
        </div>
      )}
      {uploading && (
        <div
          className="glass-effect"
          style={{ marginTop: 12, padding: 12, borderRadius: 8 }}
        >
          <div
            style={{
              color: "#0070f3",
              fontSize: 14,
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            ⚡ Uploading... {progress}%
          </div>
          <div
            style={{
              width: "100%",
              background: "rgba(0, 112, 243, 0.1)",
              borderRadius: 10,
              overflow: "hidden",
              height: 10,
              border: "1px solid rgba(0, 112, 243, 0.2)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(135deg, #0070f3, #00c6ff)",
                borderRadius: 10,
                transition: "width 0.3s ease",
                boxShadow: "0 0 10px rgba(0, 112, 243, 0.5)",
              }}
            />
          </div>
        </div>
      )}
      {error && (
        <div
          className="glass-effect"
          style={{
            color: "#e74c3c",
            marginTop: 12,
            fontSize: 14,
            padding: 12,
            borderRadius: 8,
            background: "rgba(231, 76, 60, 0.1)",
            border: "1px solid rgba(231, 76, 60, 0.3)",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            color: "#27ae60",
            marginTop: 12,
            fontSize: 14,
            padding: 8,
            borderRadius: 6,
            background: "rgba(39, 174, 96, 0.1)",
          }}
        >
          {success}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
