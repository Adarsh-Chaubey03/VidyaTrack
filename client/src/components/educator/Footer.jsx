import React from 'react'

function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} VidyaTrack. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacy</a>
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Terms</a>
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
