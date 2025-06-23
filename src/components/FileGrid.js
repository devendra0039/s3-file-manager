import React from 'react'
import FileCard from './FileCard';
import { FileText, Sparkles } from 'lucide-react';

const FileGrid = ({ files,
  onFileSelect,
  onFileDownload,
  onFileDelete,
  onDirectoryClick,
  getPreviewFileUrl }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full blur-2xl opacity-50"></div>
          <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center w-full h-full border border-slate-200/50 dark:border-slate-600/50 shadow-xl">
            <FileText className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-300 dark:to-slate-100 bg-clip-text text-transparent mb-2 sm:mb-3">
          No files found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed flex items-center justify-center gap-2 text-sm sm:text-base px-4">
          <Sparkles className="h-4 w-4 flex-shrink-0" />
          Upload your first file or adjust your search filters to see files here.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onSelect={() => onFileSelect(file)}
          onDownload={() => onFileDownload(file)}
          onDelete={() => onFileDelete(file.id)}
          onDirectoryClick={onDirectoryClick}
          getPreviewFileUrl={getPreviewFileUrl}
        />
      ))}
    </div>
  )
}

export default FileGrid