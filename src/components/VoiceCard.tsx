"use client";

import { VoiceMemo } from "@/app/page";
import { formatDate } from "@/lib/utils";
import { Clock, Globe, Trash2, Copy, CheckCircle, MoreVertical } from "lucide-react";
import { useState } from "react";

interface VoiceCardProps {
  memo: VoiceMemo;
  onDelete: () => void;
  onCopy: () => void;
  onMarkRead: () => void;
  sentimentIcon: React.ReactNode;
}

export function VoiceCard({ memo, onDelete, onCopy, onMarkRead, sentimentIcon }: VoiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const sentimentColors = {
    urgent: "border-l-red-500",
    neutral: "border-l-yellow-500",
    positive: "border-l-green-500",
  };

  return (
    <div className={`group bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover-lift relative overflow-hidden border-l-4 ${sentimentColors[memo.sentiment]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-[#3fb950] font-bold text-sm">
            {memo.sender.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h3 className="font-semibold text-[#c9d1d9] text-sm">{memo.sender}</h3>
            <div className="flex items-center gap-2 text-xs text-[#8b949e]">
              <Clock className="w-3 h-3" />
              <span>{formatDate(memo.date)}</span>
              <span>•</span>
              <span>{memo.duration}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {sentimentIcon}
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showActions && (
        <div className="absolute top-16 right-4 bg-[#0d1117] border border-[#30363d] rounded-md shadow-xl z-10 py-1 fade-in-up">
          <button
            onClick={() => { onCopy(); setShowActions(false); }}
            className="w-full px-4 py-2 text-left text-sm text-[#c9d1d9] hover:bg-[#161b22] flex items-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy Summary
          </button>
          <button
            onClick={() => { onMarkRead(); setShowActions(false); }}
            className="w-full px-4 py-2 text-left text-sm text-[#c9d1d9] hover:bg-[#161b22] flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Mark Processed
          </button>
          <button
            onClick={() => { onDelete(); setShowActions(false); }}
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#161b22] flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {memo.summary.slice(0, isExpanded ? undefined : 3).map((point, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-[#c9d1d9]">
            <span className="text-[#3fb950] mt-1.5">•</span>
            <span className="leading-relaxed">{point}</span>
          </div>
        ))}
        {!isExpanded && memo.summary.length > 3 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs text-[#3fb950] hover:underline ml-4"
          >
            +{memo.summary.length - 3} more points
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#30363d]">
        <div className="flex items-center gap-2 text-xs text-[#8b949e]">
          <Globe className="w-3 h-3" />
          <span>{memo.language}</span>
          <span className="px-2 py-0.5 rounded-full bg-[#0d1117] border border-[#30363d] text-[#3fb950]">
            {memo.sentiment}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="p-2 text-[#8b949e] hover:text-[#3fb950] hover:bg-[#0d1117] rounded-md transition-all btn-press"
            title="Copy summary"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-[#8b949e] hover:text-red-400 hover:bg-[#0d1117] rounded-md transition-all btn-press"
            title="Delete memo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}