"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult as AnalysisResultType } from "@/types";
import { getAnalyses } from "@/lib/firebase";
import { History, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { getScoreColor } from "@/lib/clarityScore";

interface HistoryPanelProps {
  onSelectAnalysis: (analysis: AnalysisResultType) => void;
  currentAnalysisId?: string;
}

export function HistoryPanel({ onSelectAnalysis, currentAnalysisId }: HistoryPanelProps) {
  const [analyses, setAnalyses] = useState<AnalysisResultType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      const data = await getAnalyses();
      setAnalyses(data.slice(0, 10)); // Show last 10 analyses
    } catch (error) {
      console.error("Error loading analyses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("analyses");
      setAnalyses([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-4">
            No analyses yet. Start by analyzing your first plan!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Analyses
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {analyses.map((analysis) => (
            <button
              key={analysis.id}
              onClick={() => onSelectAnalysis(analysis)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                currentAnalysisId === analysis.id
                  ? "bg-slate-100 border-slate-300"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-700 line-clamp-2 flex-1">
                  {analysis.originalInput}
                </p>
                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getScoreColor(analysis.clarityScore)}`}
                >
                  Score: {analysis.clarityScore}
                </Badge>
                <span className="text-xs text-slate-400">
                  {formatDate(analysis.createdAt)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
