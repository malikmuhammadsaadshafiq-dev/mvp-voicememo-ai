"use client";

import { useState } from "react";
import { Mic, Menu, X, Github, Twitter } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#238636] rounded-md flex items-center justify-center border border-[#3fb950]/30">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#c9d1d9] tracking-tight">
              VoiceMemo<span className="text-[#3fb950]">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors text-sm font-medium">Dashboard</a>
            <a href="#" className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors text-sm font-medium">Archive</a>
            <a href="#" className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors text-sm font-medium">Settings</a>
            <div className="flex items-center gap-3 border-l border-[#30363d] pl-6">
              <button className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
                <Github className="w-5 h-5" />
              </button>
              <button className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#c9d1d9] hover:bg-[#161b22] rounded-md transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#30363d] fade-in-up">
            <div className="flex flex-col gap-2">
              <a href="#" className="px-4 py-2 text-[#c9d1d9] hover:bg-[#161b22] rounded-md transition-colors">Dashboard</a>
              <a href="#" className="px-4 py-2 text-[#c9d1d9] hover:bg-[#161b22] rounded-md transition-colors">Archive</a>
              <a href="#" className="px-4 py-2 text-[#c9d1d9] hover:bg-[#161b22] rounded-md transition-colors">Settings</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}