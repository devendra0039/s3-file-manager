import React from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
                type="text"
                placeholder="Search files..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400"
            />
        </div>
    )
}

export default SearchBar