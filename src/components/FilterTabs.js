import React from 'react'
import { Button } from './ui/button';
import { Grid3X3, Image, FileText, Video } from 'lucide-react';

export const FilterTabs = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'All Files', icon: Grid3X3 },
        { id: 'images', label: 'Images', icon: Image },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'videos', label: 'Videos', icon: Video },
    ];
    return (
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                    <Button
                        key={filter.id}
                        variant={activeFilter === filter.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex-shrink-0 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm ${activeFilter === filter.id
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                                : 'bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Icon className="h-4 w-4 mr-2" />
                        {filter.label}
                    </Button>
                );
            })}
        </div>
    )
}
