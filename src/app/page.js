'use client'
import { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StatsCards from "@/components/StatsCards";
import SearchBar from "@/components/SearchBar";
import { FilterTabs } from "@/components/FilterTabs";
import UploadZone from "@/components/UploadZone";
import FileGrid from "@/components/FileGrid";
import FilePreview from "@/components/FilePreview";
import S3PathNavigator from "@/components/S3PathNavigator";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import useS3 from "@/services/useS3";
import Footer from "@/components/Footer";


export default function Home() {

  const [s3Credentials, setS3Credentials] = useState(null);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPath, setCurrentPath] = useState('');

  const {
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
  } = useS3(s3Credentials);


  // Load files when credentials or path changes
  useEffect(() => {
    if (s3Credentials) {
      fetchFiles(currentPath);
    }
  }, [s3Credentials, currentPath]);

  // Filter files based on search and filter type
  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilter === 'all') return matchesSearch;
      // if (file.isDirectory) return matchesSearch; // Always show directories

      if (activeFilter === 'images') return matchesSearch && file.type.startsWith('image/');
      if (activeFilter === 'documents') return matchesSearch && (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text'));
      if (activeFilter === 'videos') return matchesSearch && file.type.startsWith('video/');
      return matchesSearch;
    });
  }, [files, searchQuery, activeFilter]);

  const handleDirectoryClick = useCallback((directory) => {
    if (directory.isDirectory) {
      const newPath = currentPath ? `${currentPath}/${directory.name}` : directory.name;
      setCurrentPath(newPath);
    }
  }, [currentPath]);

  const handlePathChange = useCallback((newPath) => {
    setCurrentPath(newPath);
  }, []);


  const handleCreateFolder = useCallback(async (folderName) => {
    await createFolder(folderName, currentPath);
  }, [createFolder, currentPath]);

  const handleFileDelete = useCallback(async (fileId) => {
    await deleteFile(fileId, currentPath);
  }, [deleteFile, currentPath]);

  const handleGoBack = () => {
    setCurrentPath(currentPath.split('/').slice(0, -1).join('/'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navbar s3Credentials={s3Credentials} setS3Credentials={setS3Credentials} setShowUploadZone={setShowUploadZone} showUploadZone={showUploadZone} handleCreateFolder={handleCreateFolder} isLoading={isLoading} />
      <div className="relative max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Credentials Warning */}
        {!s3Credentials && (
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5"></div>
            <div className="relative flex items-start sm:items-center space-x-3">
              <div className="flex-shrink-0 mt-1 sm:mt-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-amber-800 dark:text-amber-200 font-medium text-sm sm:text-base">
                Configure your S3 credentials to unlock the full power of cloud storage management
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards files={filteredFiles} />

        {/* S3 Path Navigator */}
        <S3PathNavigator
          currentPath={currentPath}
          onPathChange={handlePathChange}
        />

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Upload Zone - Show/Hide based on state */}
        {showUploadZone && (
          <div className="mb-8 animate-fade-in">
            <UploadZone uploadFiles={uploadFiles} currentPath={currentPath} abortMultipartUpload={abortMultipartUpload} isFileUploading={isFileUploading} />
          </div>
        )}

        <div className="mb-2">
          <Button disabled={currentPath.trim() === ''} onClick={() => handleGoBack()} variant="outline" size="sm">
            <Undo2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && !showUploadZone && (
          <div className="text-center py-12 sm:py-16">
            <div className="relative mx-auto mb-4 sm:mb-6 display inline-block">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm sm:text-base">Loading your files...</p>
          </div>
        )}

        {/* <S3FileDownloader bucketName={'msuite-nextgenflow-qa'} fileKey={'309/flow/orders/369991698message/d5c815da-6676-42c…6c-5-June-2025/V0/output/eproofAllFormats/Abc.mp4'} fileName={'Abc.mp4'} /> */}

        {/* File Grid */}
        <FileGrid
          files={filteredFiles}
          onFileSelect={setSelectedFile}
          onFileDownload={downloadFile}
          onFileDelete={handleFileDelete}
          onDirectoryClick={handleDirectoryClick}
          getPreviewFileUrl={getPreviewFileUrl}
        />

        {/* File Preview Modal */}
        {selectedFile && (
          <FilePreview
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onDownload={() => downloadFile(selectedFile)}
            onDelete={() => handleFileDelete(selectedFile.id)}
            getPreviewFileUrl={getPreviewFileUrl}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
