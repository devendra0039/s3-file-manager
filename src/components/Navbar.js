import React from 'react';
import { Cloud, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
import S3CredentialsForm from './S3CredentialsForm';
import CreateFolderDialog from './CreateFolderDialog';
import ModeToggle from './ModeToggle';


const Navbar = ({s3Credentials, setS3Credentials, setShowUploadZone,  showUploadZone, handleCreateFolder, isLoading}) => {

  const toggleUploadZone = () => {
    if (!s3Credentials) {
      toast.error("S3 Credentials Not Configured",{
          description: "Please configure your S3 credentials first",
      });
      return;
    }
    setShowUploadZone(!showUploadZone);
  };

  return (
    <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-40 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl blur-lg opacity-60"></div>
                <div className="relative p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                  <Cloud className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  S3 File Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Manage your cloud storage with elegance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <ModeToggle />
              <div className="hidden sm:block">
                <S3CredentialsForm onCredentialsChange={setS3Credentials} />
              </div>
              <div className="hidden sm:block">
                <CreateFolderDialog onCreateFolder={handleCreateFolder} isLoading={isLoading} />
              </div>
              <Button 
                size="sm" 
                className={`relative overflow-hidden transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm px-3 sm:px-4 py-2 ${
                  showUploadZone 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/25' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
                }`}
                onClick={toggleUploadZone}
                disabled={!s3Credentials}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full transition-transform duration-700 hover:translate-x-full"></div>
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 relative z-10" />
                <span className="relative z-10">{showUploadZone ? 'Cancel' : 'Upload'}</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile-only credentials and folder buttons */}
          <div className="flex sm:hidden items-center space-x-2 mt-4">
            <div className="flex-1">
              <S3CredentialsForm onCredentialsChange={setS3Credentials} />
            </div>
            <CreateFolderDialog onCreateFolder={handleCreateFolder} isLoading={isLoading} />
          </div>
        </div>
      </div>
  )
}

export default Navbar