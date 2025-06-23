import { useCallback, useMemo, useState } from 'react'
import { S3Service } from './s3Service';
import { toast } from "sonner"

const useS3 = (credentials) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [files, setFiles] = useState([]);

  const s3Service = useMemo(() => {
    return credentials ? new S3Service(credentials) : null;
  }, [credentials?.accessKeyId, credentials?.secretAccessKey, credentials?.region, credentials?.bucketName]);

  const fetchFiles = useCallback(async (path = '') => {
    if (!s3Service) {
      toast.error("S3 Not Configured", {
        description: "Please configure your S3 credentials first",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prefix = path ? path.endsWith('/') ? path : `${path}/` : '';
      const fetchedFiles = await s3Service.listFiles(prefix);
      setFiles(fetchedFiles);
    } catch (error) {
      toast.error("Error Fetching Files", {
        description: error instanceof Error ? error.message : "Failed to fetch files from S3",
      });
    } finally {
      setIsLoading(false);
    }
  }, [s3Service, toast]);

  const uploadFiles = useCallback(async (uploadFiles, getFileUploadInfo, path = '') => {
    if (!s3Service) {
      toast.error("S3 Not Configured", {
        description: "Please configure your S3 credentials first",
      });
      return;
    }

    let filesRemaining = uploadFiles
    console.log("Uploading files to S3:", uploadFiles, "at path:", path);
    let uploadAll = await uploadFiles.map(async (file, index) => {
      try {
        setIsFileUploading(true);
        let status = await s3Service.uploadFile(file, getFileUploadInfo, uploadFiles, index, path)
        if (status === 'File uploaded successfully') {
          toast.success("Upload Completed", {
            description: `${file.name}  uploaded successfully`,
          });
          filesRemaining = filesRemaining.filter((e) => e.uploadId !== file.uploadId);
          await fetchFiles(path);
        }
      } catch (error) {
        toast.error("Upload Failed", {
          description: error instanceof Error ? error.message : "Failed to upload files to S3",
        });
      }
    });
    await Promise.all(uploadAll);
    setIsFileUploading(false);
    filesRemaining = filesRemaining.filter((e) => !e.isFileUploadAborted);
    return filesRemaining;
  }, [s3Service, toast, fetchFiles]);

  const createFolder = useCallback(async (folderName, path = '') => {
    if (!s3Service) {
      toast.error("S3 Not Configured", {
        description: "Please configure your S3 credentials first",
      });
      return;
    }

    setIsLoading(true);
    try {
      await s3Service.createFolder(folderName, path);

      toast.success("Folder Created", {
        description: `Folder "${folderName}" created successfully`,
      });

      // Refresh the file list
      await fetchFiles(path);
    } catch (error) {
      toast.error("Failed to Create Folder", {
        description: error instanceof Error ? error.message : "Failed to create folder in S3",
      });
    } finally {
      setIsLoading(true);
    }
  }, [s3Service, toast, fetchFiles]);

  const deleteFile = useCallback(async (fileKey, currentPath = '') => {
    if (!s3Service) {
      toast.error("S3 Not Configured", {
        description: "Please configure your S3 credentials first",
      });
      return;
    }

    setIsLoading(true);
    try {
      await s3Service.deleteFile(fileKey);

      toast.success("File Deleted", {
        description: "File has been removed from S3",
      });

      // Refresh the file list
      await fetchFiles(currentPath);
    } catch (error) {
      toast.error("Delete Failed", {
        description: error instanceof Error ? error.message : "Failed to delete file from S3",
      });
    } finally {
      setIsLoading(false);
    }
  }, [s3Service, toast, fetchFiles]);

  const downloadFile = useCallback(async (file) => {
    if (!s3Service) {
      toast.error("S3 Not Configured", {
        description: "Please configure your S3 credentials first",
      });
      return;
    }

    const url = await s3Service.getFileUrl(file.id);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    // link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download Started", {
      description: `Downloading ${file.name} from S3`,
    });
  }, [s3Service, toast]);

  const getPreviewFileUrl = useCallback(async (fileKey) => {
    if (!s3Service) {
      toast.error("S3 Not Configured", {
        description: "Please configure your S3 credentials first",
      });
      return;
    }
    return await s3Service.getPreviewFileUrl(fileKey);
  }, [s3Service, toast]);

  const abortMultipartUpload = useCallback(async (key, uploadId, file) => {
    try{
      await s3Service.abortMultipartUpload(key, uploadId, file);
      toast.success("Upload Aborted", {
        description: `Multipart upload for ${file.name} has been aborted`,
      });
    }catch (error) {
      toast.error("Abort Failed", {
        description: error instanceof Error ? error.message : "Failed to abort multipart upload",
      });
    }
  }, [s3Service]);

  return {
    files,
    isLoading,
    isFileUploading,
    fetchFiles,
    uploadFiles,
    createFolder,
    deleteFile,
    downloadFile,
    getPreviewFileUrl,
    abortMultipartUpload
  };
}

export default useS3