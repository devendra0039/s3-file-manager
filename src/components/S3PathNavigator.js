import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Home, FolderOpen, SendHorizonal } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';

const S3PathNavigator = ({ currentPath,
    onPathChange }) => {

    const [inputPath, setInputPath] = useState(currentPath);

    const handlePathSubmit = useCallback((e) => {
        e.preventDefault();
        onPathChange(inputPath);
      }, [inputPath, onPathChange]);

      const handleBreadcrumbClick = useCallback((path) => {
        setInputPath(path);
        onPathChange(path);
      }, [onPathChange]);

    // Generate breadcrumb items from current path
    const breadcrumbItems = useMemo(() => {
        if (!currentPath) {
          return [{ name: 'Root', path: '' }];
        }
    
        const pathParts = currentPath.split('/').filter(part => part.length > 0);
        const breadcrumbs = [{ name: 'Root', path: '' }];
        
        let currentPathBuild = '';
        pathParts.forEach((part, index) => {
          currentPathBuild += (index === 0 ? '' : '/') + part;
          breadcrumbs.push({
            name: part,
            path: currentPathBuild
          });
        });
    
        return breadcrumbs;
      }, [currentPath]);

    // Update input when current path changes externally
    useEffect(() => {
        setInputPath(currentPath);
    }, [currentPath]);
    return (
        <Card className="mb-6 p-4 bg-white/80 backdrop-blur-sm border-slate-200 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
            <div className="space-y-4">
                {/* Breadcrumb Navigation */}
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbItems.map((item, index) => (
                                <React.Fragment key={item.path}>
                                    <BreadcrumbItem>
                                        {index === breadcrumbItems.length - 1 ? (
                                            <BreadcrumbPage className="flex items-center">
                                                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                                                {item.name}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleBreadcrumbClick(item.path);
                                                }}
                                                className="flex items-center hover:text-blue-600 transition-colors"
                                            >
                                                {index === 0 && <Home className="h-4 w-4 mr-1" />}
                                                {item.name}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Path Input Field */}
                <div>
                    <form onSubmit={handlePathSubmit} className="flex gap-2">
                        <div className="flex-1 relative">
                            <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="text"
                                value={inputPath}
                                onChange={(e) => setInputPath(e.target.value)}
                                placeholder="Enter S3 path (e.g., documents/reports)"
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline" type="submit" size="sm">
                            <SendHorizonal className="h-4 w-4" />
                        </Button>
                    </form>
                    <p className="text-xs text-slate-500 mt-1">
                        Leave empty for root directory, or enter path like "documents/reports"
                    </p>
                </div>
            </div>
        </Card>
    )
}

export default S3PathNavigator