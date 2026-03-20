"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Footprints, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Download,
  Copy,
  Check
} from "lucide-react";

interface ActionableStepsProps {
  steps: string[];
  planId?: string;
}

export function ActionableSteps({ steps, planId }: ActionableStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  // Load completed steps from localStorage
  useEffect(() => {
    if (planId) {
      const saved = localStorage.getItem(`plan-${planId}-progress`);
      if (saved) {
        setCompletedSteps(new Set(JSON.parse(saved)));
      }
    }
  }, [planId]);

  // Save completed steps to localStorage
  useEffect(() => {
    if (planId) {
      localStorage.setItem(
        `plan-${planId}-progress`, 
        JSON.stringify(Array.from(completedSteps))
      );
    }
  }, [completedSteps, planId]);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const resetProgress = () => {
    setCompletedSteps(new Set());
    if (planId) {
      localStorage.removeItem(`plan-${planId}-progress`);
    }
  };

  const copySteps = () => {
    const stepsText = steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
    navigator.clipboard.writeText(stepsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSteps = () => {
    const stepsText = steps.map((step, i) => `${i + 1}. ${step}`).join("\n");
    const blob = new Blob([stepsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "action-steps.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const progress = steps.length > 0 ? Math.round((completedSteps.size / steps.length) * 100) : 0;

  if (steps.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-slate-700" />
            <CardTitle className="text-lg">Actionable Next Steps</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No actionable steps could be generated.</p>
            <p className="text-xs mt-1">Try providing more details about your plan.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-slate-700" />
            <CardTitle className="text-lg">Your Action Plan</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copySteps}
              className="h-8 px-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadSteps}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-slate-900">{completedSteps.size}/{steps.length} completed ({progress}%)</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isCompleted 
                    ? "bg-green-50 border-green-200 opacity-75" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
                onClick={() => toggleStep(index)}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={isCompleted ? "default" : "secondary"}
                      className={isCompleted ? "bg-green-500" : ""}
                    >
                      Step {index + 1}
                    </Badge>
                    {isCompleted && (
                      <span className="text-xs text-green-600 font-medium">Completed</span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    isCompleted ? "text-slate-500 line-through" : "text-slate-700"
                  }`}>
                    {step}
                  </p>
                </div>
                <Checkbox 
                  checked={isCompleted}
                  onCheckedChange={() => toggleStep(index)}
                  className="mt-1 shrink-0"
                />
              </div>
            );
          })}
        </div>
        
        {/* Reset Button */}
        {completedSteps.size > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={resetProgress}
              className="flex items-center gap-2 text-slate-500"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Progress
            </Button>
          </div>
        )}
        
        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">Congratulations!</p>
            <p className="text-sm text-green-600">You&apos;ve completed all the action steps for this plan.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
