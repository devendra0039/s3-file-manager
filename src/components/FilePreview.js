import React, { useState } from 'react'
import { Download, Trash2, FileText, Image as ImageIcon, Video, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { formatDate, formatFileSize } from '@/lib/fileUtils';
import DeleteFileDialog from './DeleteFileDialog';

const FilePreview = ({
    file,
    onClose,
    onDownload,
    onDelete,
    getPreviewFileUrl,
}) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isPDF = file.type === 'application/pdf';

    const [previewUrl, setPreviewUrl] = useState(null);

    const getFileIcon = () => {
        if (isImage) return ImageIcon;
        if (isVideo) return Video;
        if (isPDF) return FileText;
        return File;
    };

    const getPreviewSignedUrl = async () => {
        const signedUrl = await getPreviewFileUrl(file.id);
        setPreviewUrl(signedUrl);
    };

    (isImage || isVideo) && getPreviewSignedUrl()

    const Icon = getFileIcon();
    return (
        <Dialog open={true} onOpenChange={onClose} >
            <DialogContent className="max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl">
                <DialogHeader className={'max-w-[26vw]'}>
                    <div className="flex items-center justify-between pr-4 pt-2">
                        <DialogTitle className="text-xl font-semibold text-slate-900 dark:from-white dark:to-slate-300 bg-clip-text text-transparent pr-4 truncate flex-1">
                            {file.name}
                        </DialogTitle>
                        <div className="flex items-center space-x-2">
                            <Button
                                size="sm"
                                onClick={() => onDownload(file)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                            <DeleteFileDialog  file={file} onClose={onClose} onDelete={onDelete} isButton={true} />
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 ">
                    {/* File Preview */}
                    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 transition-colors duration-500 rounded-lg p-8 min-h-[400px] flex items-center justify-center ">
                        {isImage ? (
                            <img
                                src={previewUrl}
                                alt={file.name}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            />
                        ) : isVideo ? (
                            <video
                                src={previewUrl}
                                controls
                                className="max-w-full max-h-full rounded-lg shadow-lg"
                            />
                        ) : isPDF ? (
                            <div className="text-center">
                                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="h-10 w-10 text-red-600" />
                                </div>
                                <p className="text-slate-400 mb-4">PDF preview not available</p>
                                <Button onClick={() => onDownload(file)}>
                                    Open PDF
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center ">
                                <div className="mx-auto w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                    <Icon className="h-10 w-10 text-slate-500" />
                                </div>
                                <p className="text-slate-400">Preview not available for this file type</p>
                            </div>
                        )}
                    </div>

                    {/* File Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">File Size</p>
                            <p className="text-sm text-slate-400 mt-1">{formatFileSize(file.size)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">File Type</p>
                            <p className="text-sm text-slate-400 mt-1">{file.type}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Last Modified</p>
                            <p className="text-sm text-slate-400 mt-1">{formatDate(file.lastModified)}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default FilePreview