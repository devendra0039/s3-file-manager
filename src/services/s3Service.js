import { FILE_UPLOAD_BATCH_SIZE, FILE_UPLOAD_TIMEOUT, getFileParts, MAX_FILE_UPLOAD_RETRIES, MAX_FILE_UPLOAD_RETRY_DELAY } from '@/lib/fileUtils';
import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, AbortMultipartUploadCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';

export class S3Service {
  s3Client
  bucketName
  constructor(credentials) {
    this.s3Client = new S3Client({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
    this.bucketName = credentials.bucketName;
  }

  async listFiles(prefix = '') {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        Delimiter: '/',
      });

      const response = await this.s3Client.send(command);
      const files = [];

      // Add directories (common prefixes)
      if (response.CommonPrefixes) {
        for (const commonPrefix of response.CommonPrefixes) {
          if (commonPrefix.Prefix) {
            const dirName = commonPrefix.Prefix.replace(prefix, '').replace('/', '');
            if (dirName) {
              files.push({
                id: `dir-${commonPrefix.Prefix}`,
                name: dirName,
                size: 0,
                type: 'directory',
                lastModified: new Date(),
                url: '',
                isDirectory: true,
                path: prefix,
              });
            }
          }
        }
      }

      // Add files
      if (response.Contents) {
        for (const object of response.Contents) {
          if (object.Key && object.Key !== prefix && !object.Key.endsWith('/')) {
            const fileName = object.Key.replace(prefix, '');
            files.push({
              id: object.Key,
              name: fileName,
              size: object.Size || 0,
              type: this.getContentType(fileName),
              lastModified: object.LastModified || new Date(),
              url: `https://${this.bucketName}.s3.amazonaws.com/${object.Key}`,
              isDirectory: false,
              path: prefix,
            });
          }
        }
      }

      return files;
    } catch (error) {
      console.error('Error listing S3 files:', error);
      throw new Error('Failed to fetch files from S3');
    }
  }

  async createFolder(folderName, path = '') {
    try {
      const key = path ? `${path}/${folderName}/` : `${folderName}/`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: '',
      });

      await this.s3Client.send(command);
      return key;
    } catch (error) {
      console.error('Error creating folder in S3:', error);
      throw new Error('Failed to create folder in S3');
    }
  }

  async deleteFile(key) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file from S3');
    }
  }

  async checkFileExists(key) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  getContentType(fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'zip': 'application/zip',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  async getFileUrl(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key, // e.g., "path/to/your/file.txt"
        ResponseContentDisposition: `attachment; filename="${key.split("/").pop()}"`,
      });
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }


  async getPreviewFileUrl(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key, // e.g., "path/to/your/file.txt"
        ResponseContentDisposition: 'inline',
      });
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }


  // Initiate multipart upload
  async initiateMultipartUpload(key) {
    try {
      const command = new CreateMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const { UploadId } = await this.s3Client.send(command);
      return { uploadId: UploadId };
    } catch (error) {
      console.error(`Error initiating multipart upload for ${key}:`, error);
      throw new Error(`Failed to initiate multipart upload: ${error.message}`);
    }
  }

  // Generate presigned URLs for uploading parts
  async getPartUploadUrls(key, uploadId, partCount) {
    try {
      const urls = [];
      for (let partNumber = 1; partNumber <= partCount; partNumber++) {
        const command = new UploadPartCommand({
          Bucket: this.bucketName,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });
        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
        urls.push({ partNumber, url });
      }
      return urls;
    } catch (error) {
      console.error(`Error generating part upload URLs for ${key}:`, error);
      throw new Error(`Failed to generate part URLs: ${error.message}`);
    }
  }

  // Complete multipart upload
  async completeMultipartUpload(key, uploadId, parts) {
    try {
      const command = new CompleteMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Error completing multipart upload for ${key}:`, error);
      throw new Error(`Failed to complete multipart upload: ${error.message}`);
    }
  }

  // Abort multipart upload (cleanup on failure)
  async abortMultipartUpload(key, uploadId, file) {
    try {
      const command = new AbortMultipartUploadCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
      });
      await this.s3Client.send(command);
      file.isFileUploadAborted = true; // Set aborted state in the file object
      console.log(`Multipart upload aborted for ${key}`);
    } catch (error) {
      console.error(`Error aborting multipart upload for ${key}:`, error);
      throw new Error(`Failed to abort multipart upload: ${error.message}`);
    }
  }

  uploadWithTimeout = async (url, part, signal) => {
    try {
      const response = await axios.put(url, part, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        signal: signal,
        timeout: FILE_UPLOAD_TIMEOUT,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };


  uploadWithRetry = async (url, part, partNumber, file, retries = MAX_FILE_UPLOAD_RETRIES) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn(`Aborting part ${partNumber} due to timeout after ${FILE_UPLOAD_TIMEOUT / 1000}s`);
    }, FILE_UPLOAD_TIMEOUT);

    try {
      const response = !file.isFileUploadAborted && await this.uploadWithTimeout(url, part, controller.signal);
      clearTimeout(timeoutId);
      return {
        ETag: response.headers.etag,
        PartNumber: partNumber,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (retries > 0) {
        if (file.isFileUploadAborted) {
          console.log("File upload Aborted");
        } else {
          const delay = MAX_FILE_UPLOAD_RETRY_DELAY;
          console.warn(`Retrying part ${partNumber} due to error: ${error.message}. Retries left: ${retries}`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.uploadWithRetry(url, part, partNumber, file, retries - 1);
        }
      } else {
        console.error(`Failed to upload part ${partNumber} after ${MAX_FILE_UPLOAD_RETRIES} retries: ${error.message}`);
        throw error;
      }
    }
  };



  async uploadFile(file, getFileUploadInfo, files, index,  path = '') {
    try {
      const key = file.key
      const fileParts = getFileParts(file);
      const partCount = fileParts.length;
      const { uploadId } = await this.initiateMultipartUpload(key);
      file.uploadId = uploadId; 
      console.log(`Initiated multipart upload for ${key} with ID: ${uploadId}`);
      const presignedUrls = await this.getPartUploadUrls(key, uploadId, partCount);
      const uploadedParts = [];
      for (let i = 0; i < presignedUrls.length; i += FILE_UPLOAD_BATCH_SIZE) {
        const batch = presignedUrls.slice(i, i + FILE_UPLOAD_BATCH_SIZE);
        const batchPromises = batch.map(async (presignedUrl, index) => {
          const partIndex = i + index;
          console.log(`Uploading part ${presignedUrl.partNumber}...`);
          file.uploadProgress = Math.min(99, Math.round(((partIndex + 1) / partCount) * 100));
          const result = !file.isFileUploadAborted && await this.uploadWithRetry(
            presignedUrl.url,
            fileParts[partIndex],
            presignedUrl.partNumber,
            file
          );
          getFileUploadInfo(file);
          return result;
        });
        try {
          const batchResults = await Promise.all(batchPromises);
          uploadedParts.push(...batchResults);
        } catch (error) {
          throw error;
        }
      }
      if (!file.isFileUploadAborted) {
        await this.completeMultipartUpload(key, uploadId, uploadedParts)
        file.uploadProgress = 100; 
        console.log('File uploaded successfully:', key);
        return "File uploaded successfully";
      } 
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
    finally {
      getFileUploadInfo(file);
    }
  }

}   