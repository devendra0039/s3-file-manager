import { Heart } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
     <footer className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50 mt-12 sm:mt-16">
            <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>Developed with</span>
                        <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                        <span>by</span>
                        <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Devendra Sahu
                        </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
                        © {new Date().getFullYear()} All rights reserved
                    </div>
                </div>
            </div>
        </footer>
  )
}

export default Footer