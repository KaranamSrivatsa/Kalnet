"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StructuredOutput } from "@/types";
import { Goal, Route, ListOrdered, Clock, RefreshCw } from "lucide-react";

interface AnalysisResultProps {
  originalInput: string;
  structuredOutput: StructuredOutput;
}

export function AnalysisResult({ originalInput, structuredOutput }: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      {/* Simplified Version */}
      <Card className="w-full border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-500" />
            Simplified Version
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">
            {structuredOutput.simplifiedVersion}
          </p>
        </CardContent>
      </Card>

      {/* Structured Components */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Goal */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Goal className="h-5 w-5 text-slate-700" />
              <CardTitle className="text-base">Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {structuredOutput.goal ? (
              <p className="text-sm text-slate-700">{structuredOutput.goal}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Not specified</p>
            )}
          </CardContent>
        </Card>

        {/* Method */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-slate-700" />
              <CardTitle className="text-base">Method / Approach</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {structuredOutput.method ? (
              <p className="text-sm text-slate-700">{structuredOutput.method}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">Not specified</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Steps */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-slate-700" />
            <CardTitle className="text-base">Steps</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {structuredOutput.steps && structuredOutput.steps.length > 0 ? (
            <ol className="space-y-2">
              {structuredOutput.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <Badge variant="outline" className="mt-0.5 shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400 italic">No specific steps identified</p>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-700" />
            <CardTitle className="text-base">Timeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {structuredOutput.timeline ? (
            <p className="text-sm text-slate-700">{structuredOutput.timeline}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">No timeline specified</p>
          )}
        </CardContent>
      </Card>

      {/* Original Input (Collapsible) */}
      <Card className="w-full bg-slate-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-500">Original Input</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 italic">&ldquo;{originalInput}&rdquo;</p>
        </CardContent>
      </Card>
    </div>
  );
}
