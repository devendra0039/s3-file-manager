import React, { useState } from 'react'
import { Download, FileText, Image, Video, Archive, Trash2, Eye, Folder, FolderOpen } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { formatDate, formatFileSize } from '@/lib/fileUtils';
import DeleteFileDialog from './DeleteFileDialog';

const FileCard = ({
    file,
    onSelect,
    onDownload,
    onDelete,
    onDirectoryClick,
    getPreviewFileUrl
}) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const getFileIcon = () => {
        if (file.isDirectory) return Folder;
        if (file.type.startsWith('image/')) return Image;
        if (file.type.startsWith('video/')) return Video;
        if (file.type.includes('zip') || file.type.includes('rar')) return Archive;
        return FileText;
    };

    const Icon = getFileIcon();
    const isImage = file.type.startsWith('image/');
    const isDirectory = file.isDirectory;

    const getPreviewSignedUrl = async () => {
        const signedUrl = await getPreviewFileUrl(file.id);
        setPreviewUrl(signedUrl);
    };

    isImage && getPreviewSignedUrl()

    const handleCardClick = () => {
        if (isDirectory && onDirectoryClick) {
            onDirectoryClick(file);
        } else {
            onSelect();
        }
    };

    return (
        <Card
            className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 ${isDirectory ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-600' : ''
                }`}
            onClick={isDirectory ? handleCardClick : undefined}
        >
            <CardContent className="p-3 sm:p-4">
                {/* File Preview/Icon */}
                <div className="relative mb-3 sm:mb-4 h-24 sm:h-28 lg:h-32 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                    {isDirectory ? (
                        <div className="relative">
                            <Icon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-blue-500 group-hover:text-blue-600 transition-colors" />
                            <FolderOpen className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-blue-600 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ) : isImage ? (
                        <img
                            src={previewUrl}
                            alt={file.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                const target = e.target;
                                target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <Icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-slate-400 dark:text-slate-500" />
                    )}

                    {file.isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Hover Actions - Only for files, not directories */}
                    {!isDirectory && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-1 sm:space-x-2 rounded-lg">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect();
                                }}
                            >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDownload();
                                }}
                            >
                                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <DeleteFileDialog file={file} onDelete={onDelete} isButton={false} />
                        </div>
                    )}

                    {/* Directory indicator */}
                    {isDirectory && (
                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-blue-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            DIR
                        </div>
                    )}
                </div>

                {/* File Info */}
                <div className="space-y-1 sm:space-y-2">
                    <h3 className={`font-medium truncate text-sm sm:text-base ${isDirectory ? 'text-blue-700 group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300' : 'text-slate-900 dark:text-slate-100'
                        }`} title={file.name}>
                        {file.name}
                    </h3>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="truncate flex-1 mr-2">{isDirectory ? 'Directory' : formatFileSize(file.size)}</span>
                        <span className="text-xs whitespace-nowrap">{formatDate(file.lastModified)}</span>
                    </div>
                    {isDirectory && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Click to open</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default FileCard