import {  Files, HardDrive, Image, FileText, Video  } from 'lucide-react';
import React from 'react'
import { Card, CardContent } from './ui/card';
import { formatFileSize } from '@/lib/fileUtils';

const StatsCards = ({ files }) => {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const imageCount = files.filter(file => file.type.startsWith('image/')).length;
    const documentCount = files.filter(file =>
        file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')
    ).length;
    const videoCount = files.filter(file => file.type.startsWith('video/')).length;

    const stats = [
        {
            label: 'Storage Used',
            value: formatFileSize(totalSize),
            icon: HardDrive,
            color: 'from-emerald-500 to-teal-600'
        },
        {
            label: 'Total Files',
            value: files.length.toString(),
            icon: Files,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            label: 'Images',
            value: imageCount.toString(),
            icon: Image,
            color: 'from-purple-500 to-pink-600'
        },
         {
            label: 'Videos',
            value: videoCount.toString(),
            icon: Video,
            color: 'from-purple-500 to-pink-600'
        },
        // {
        //     label: 'Documents',
        //     value: documentCount.toString(),
        //     icon: FileText,
        //     color: 'from-orange-500 to-red-600'
        // }
    ];
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 hover:shadow-lg transition-shadow">
                        <CardContent  className="p-3 sm:p-4 lg:p-6">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{stat.label}</p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">{stat.value}</p>
                                </div>
                                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex-shrink-0 ml-2`}>
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default StatsCards