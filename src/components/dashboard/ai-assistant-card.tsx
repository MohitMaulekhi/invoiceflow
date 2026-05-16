"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { analyzeSalesAction } from "@/server/actions/ai/analyze-sales";
export function AIAssistantCard() {
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    setError(null);
    startTransition(async () => {
      const result = await analyzeSalesAction();
      if (result.error) {
        setError(result.error);
      } else if (result.text) {
        setInsight(result.text);
      }
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-slate-900 via-teal-900 to-slate-900 text-white p-8 h-full min-h-75 shadow-lg flex flex-col">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-teal-300" />
          AI Assistant
        </h2>
        <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-[90%]">
          {insight ? insight : "Analyze product sales over the last year. Compare revenue, quality, sales and brand."}
        </p>
        {error && <p className="text-rose-400 text-xs mt-2">{error}</p>}
      </div>

      <div className="relative z-10 mt-auto pt-8">
        <button 
          onClick={handleAnalyze}
          disabled={isPending}
          className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md px-6 py-4 rounded-full w-full transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="flex-1 text-left">Analyze product sales</span>
          )}
          {!isPending && (
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
