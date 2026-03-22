"use client";

import { useState } from "react";
import { InputSection } from "@/components/InputSection";
import { AnalysisResult } from "@/components/AnalysisResult";
import { ClarityScore } from "@/components/ClarityScore";
import { MissingElements } from "@/components/MissingElements";
import { ActionableSteps } from "@/components/ActionableSteps";
import { HistoryPanel } from "@/components/HistoryPanel";
import { Button } from "@/components/ui/button";
import { AnalysisResult as AnalysisResultType, ClarityScoreBreakdown, QualityIndicators } from "@/types";
import { Brain, RotateCcw, Sparkles } from "lucide-react";

interface ApiResponse extends AnalysisResultType {
  scoreBreakdown: ClarityScoreBreakdown;
  qualityIndicators?: QualityIndicators;
}

export default function Home() {
  const [currentAnalysis, setCurrentAnalysis] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          input,
          useGroq: true // Always use Groq AI
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze plan");
      }

      setCurrentAnalysis(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setError("Request timed out. Please try again with a shorter input.");
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentAnalysis(null);
    setError(null);
  };

  const handleSelectFromHistory = (analysis: AnalysisResultType) => {
    // Recalculate score breakdown for history items using missingElements (STRICT FORMULA)
    const scoreBreakdown: ClarityScoreBreakdown = {
      goalDefinition: !analysis.missingElements.goalClarity ? 30 : 0,
      executionSteps: !analysis.missingElements.executionSteps ? 30 : 0,
      methodClarity: 0, // Not tracked in missingElements
      timeline: !analysis.missingElements.timeline ? 25 : 0,
      resources: !analysis.missingElements.resources ? 15 : 0,
      total: analysis.clarityScore,
    };

    setCurrentAnalysis({
      ...analysis,
      scoreBreakdown,
    });
    setError(null);
    
    // Scroll to results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Explain My Plan</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">AI Clarity & Structuring Tool</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            {!currentAnalysis && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Turn Your Ideas Into Actionable Plans
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Describe your idea or plan in your own words. Our AI will structure it, 
                  identify missing elements, and provide actionable next steps.
                </p>
              </div>
            )}

            <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Analysis Results */}
            {currentAnalysis && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-slate-700" />
                    Analysis Results
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Analyze New Plan
                  </Button>
                </div>

                <AnalysisResult
                  originalInput={currentAnalysis.originalInput}
                  structuredOutput={currentAnalysis.structuredOutput}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ClarityScore
                    score={currentAnalysis.clarityScore}
                    breakdown={currentAnalysis.scoreBreakdown}
                    missingElements={currentAnalysis.missingElements}
                  />
                  <MissingElements
                    missingElements={currentAnalysis.missingElements}
                  />
                </div>

                <ActionableSteps steps={currentAnalysis.actionableSteps} planId={currentAnalysis.id} />
              </div>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <HistoryPanel
                onSelectAnalysis={handleSelectFromHistory}
                currentAnalysisId={currentAnalysis?.id}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            Built with Next.js, Groq AI, and Firebase. All processing happens in real-time.
          </p>
        </div>
      </footer>
    </main>
  );
}
