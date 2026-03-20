"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MissingElements as MissingElementsType } from "@/types";
import { 
  CheckCircle2, 
  XCircle, 
  Target, 
  ListTodo, 
  Package, 
  Clock 
} from "lucide-react";

interface MissingElementsProps {
  missingElements: MissingElementsType;
}

const ELEMENTS = [
  { key: "goalClarity", label: "Goal Clarity", description: "Is your goal specific and measurable?", icon: Target },
  { key: "executionSteps", label: "Execution Steps", description: "Are there clear steps to follow?", icon: ListTodo },
  { key: "resources", label: "Resources", description: "Are required resources mentioned?", icon: Package },
  { key: "timeline", label: "Timeline", description: "Is there a time component?", icon: Clock },
] as const;

export function MissingElements({ missingElements }: MissingElementsProps) {
  const missingCount = Object.values(missingElements).filter(Boolean).length;
  const presentCount = ELEMENTS.length - missingCount;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Missing Elements</CardTitle>
          <Badge variant={missingCount === 0 ? "success" : "warning"}>
            {presentCount}/{ELEMENTS.length} Present
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ELEMENTS.map(({ key, label, description, icon: Icon }) => {
            const isMissing = missingElements[key as keyof MissingElementsType];
            
            return (
              <div
                key={key}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isMissing 
                    ? "bg-amber-50 border-amber-200" 
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className={`mt-0.5 ${isMissing ? "text-amber-600" : "text-green-600"}`}>
                  {isMissing ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{description}</p>
                  {isMissing && (
                    <p className="text-xs text-amber-700 mt-2 font-medium">
                      Consider adding this to improve your plan
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
