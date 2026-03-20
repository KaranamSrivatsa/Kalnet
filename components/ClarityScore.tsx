"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClarityScoreBreakdown, MissingElements } from "@/types";
import { 
  getScoreColor, 
  getScoreBgColor, 
  getScoreInterpretation 
} from "@/lib/clarityScore";
import { Target, ListTodo, Clock, Package } from "lucide-react";

interface ClarityScoreProps {
  score: number;
  breakdown: ClarityScoreBreakdown;
  missingElements?: MissingElements;
}

// 4 dimensions matching MissingElements exactly
const SCORE_DIMENSIONS = [
  { key: "goalDefinition", label: "Goal Definition", icon: Target, max: 30, missingKey: "goalClarity" },
  { key: "executionSteps", label: "Execution Steps", icon: ListTodo, max: 30, missingKey: "executionSteps" },
  { key: "timeline", label: "Timeline", icon: Clock, max: 25, missingKey: "timeline" },
  { key: "resources", label: "Resources", icon: Package, max: 15, missingKey: "resources" },
] as const;

export function ClarityScore({ score, breakdown, missingElements }: ClarityScoreProps) {
  const scoreColor = getScoreColor(score);
  const scoreBgColor = getScoreBgColor(score);
  const interpretation = getScoreInterpretation(score);
  
  // Debug logging for score verification
  console.log("ClarityScore Component:", { 
    score, 
    breakdown, 
    missingElements,
    calculatedTotal: breakdown.goalDefinition + breakdown.executionSteps + breakdown.timeline + breakdown.resources
  });
  
  // Count present elements from missingElements
  const presentCount = missingElements 
    ? Object.values(missingElements).filter(v => !v).length 
    : 0;
  const missingCount = 4 - presentCount;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Clarity Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
                className={`${scoreColor} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <p className="text-center text-sm text-slate-600">{interpretation}</p>
        
        {/* Elements Summary */}
        <div className="flex justify-center gap-2 text-xs">
          <span className="text-green-600 font-medium">{presentCount} Present</span>
          {missingCount > 0 && (
            <>
              <span className="text-slate-400">|</span>
              <span className="text-amber-600 font-medium">{missingCount} Missing</span>
            </>
          )}
        </div>

        {/* Score Breakdown - matches MissingElements exactly */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-sm font-medium text-slate-700">Score Breakdown</h4>
          {SCORE_DIMENSIONS.map(({ key, label, icon: Icon, max, missingKey }) => {
            const value = breakdown[key as keyof ClarityScoreBreakdown] as number;
            const isMissing = missingElements ? missingElements[missingKey as keyof MissingElements] : value === 0;
            const percentage = (value / max) * 100;
            
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className={`flex items-center gap-2 ${isMissing ? 'text-amber-600' : 'text-slate-600'}`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                    {isMissing && <span className="text-[10px] text-amber-500">(missing)</span>}
                  </div>
                  <span className={`font-medium ${isMissing ? 'text-amber-600' : 'text-green-600'}`}>
                    {value}/{max}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isMissing ? 'bg-amber-400' : scoreBgColor} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
