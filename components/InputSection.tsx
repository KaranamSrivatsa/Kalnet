"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Lightbulb } from "lucide-react";

interface InputSectionProps {
  onAnalyze: (input: string) => void;
  isLoading: boolean;
}

const EXAMPLE_INPUTS = [
  "I want to start a YouTube channel about cooking and monetize it within 6 months",
  "I need to learn Python for data science in 3 months using my laptop with $500 budget",
  "I want to lose 20 pounds in 90 days through diet and exercise - I have gym membership",
  "Launching fitness coaching business: Target $5K/month in 90 days, $2K budget, NASM certified",
];

export function InputSection({ onAnalyze, isLoading }: InputSectionProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-slate-700" />
          Explain Your Plan
        </CardTitle>
        <CardDescription>
          Enter your idea or plan with as much detail as possible. Our AI will structure it using evidence-based frameworks and identify gaps.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Describe your idea or plan here... (e.g., I want to start a YouTube channel about cooking)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[150px] resize-none"
            maxLength={5000}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {input.length}/5000 characters
            </span>
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Plan
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-700">Try an example:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_INPUTS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors text-left"
              >
                {example.length > 40 ? example.substring(0, 40) + "..." : example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
