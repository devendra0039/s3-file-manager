import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

const UploadZone = ({ uploadFiles, currentPath, abortMultipartUpload, isFileUploading }) => {
    const [pendingFiles, setPendingFiles] = useState([]);
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(file => {
            file.uploadProgress = 0;
            file.uploadId = null;
            file.isFileUploadAborted = false;
            file.key = currentPath ? `${currentPath}/${file.name}` : file.name;
        }
        );
        console.log("Files dropped:", acceptedFiles);
        setPendingFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/*': ['.txt', '.csv'],
            'video/*': ['.mp4', '.mov', '.avi'],
            'application/zip': ['.zip'],
        }
    });

    const getFileUploadInfo = (uploadingFile) => {
        console.log("Calculating upload progress for file:", uploadingFile);
        pendingFiles.forEach((file, index) => {
            file.uploadId === uploadingFile.uploadId && (file.uploadProgress = uploadingFile.uploadProgress);
            setPendingFiles(prev => [...prev]);
        });
    }

    const handleUpload = async () => {
        if (pendingFiles.length > 0) {
            let result = await uploadFiles(pendingFiles, getFileUploadInfo, currentPath)
            setPendingFiles(result);
        }
    };

    const removePendingFile = (index) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
        pendingFiles[index].uploadId !== null && abortMultipartUpload(pendingFiles[index].key, pendingFiles[index].uploadId, pendingFiles[index])
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (
        <div className="space-y-4">
            <Card className="border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors bg-white/50 backdrop-blur-sm">
                <div
                    {...getRootProps()}
                    className={`p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'bg-blue-50 border-blue-400' : ''
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-white" />
                    </div>
                    {isDragActive ? (
                        <p className="text-lg text-blue-600 font-medium">Drop the files here...</p>
                    ) : (
                        <div>
                            <p className="text-lg text-slate-700 font-medium mb-2">
                                Drag & drop files here, or click to select
                            </p>
                            <p className="text-sm text-slate-500">
                                Supports images, documents, videos, and more
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {pendingFiles.length > 0 && (
                <Card className="p-4 bg-white/50 backdrop-blur-sm ">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-slate-900">Ready to Upload ({pendingFiles.length} files)</h3>
                        <Button
                            onClick={handleUpload}
                            disabled={isFileUploading}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                            {isFileUploading ? 'Uploading...' : 'Upload All'}
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {pendingFiles.map((file, index) => (
                            <div>
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-30 rounded-lg bg-white/2 backdrop-blur-sm  ">
                                    <div className="flex items-center space-x-3 w-full">
                                        <File className="h-5 w-5 text-slate-400" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    {isFileUploading && (
                                        <Progress value={file.uploadProgress || 0} className="h-2 w-100 mr-5 dark:bg-slate-600" />
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removePendingFile(index)}
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

        </div>
    )
}

export default UploadZone