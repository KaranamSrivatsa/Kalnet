import { StructuredOutput, MissingElements, ClarityScoreBreakdown } from "@/types";

export function calculateClarityScore(
  structuredOutput: StructuredOutput,
  missingElements: MissingElements
): ClarityScoreBreakdown {
  // Score is based on what the USER provided, NOT what the AI suggested
  // missingElements = TRUE means the user did NOT provide that element
  // 4 dimensions matching the MissingElements panel: Goal, Steps, Timeline, Resources
  
  let goalDefinition = 0;
  let executionSteps = 0;
  let methodClarity = 0; // Will be derived from executionSteps
  let timeline = 0;
  let resources = 0;

  // Goal Definition (30 points max)
  // Only give points if user provided a clear goal (missingElements.goalClarity = false)
  if (!missingElements.goalClarity) {
    goalDefinition = 30; // User provided clear goal
  }

  // Execution Steps (30 points max) - increased to match importance
  // Only give points if user provided steps (missingElements.executionSteps = false)
  if (!missingElements.executionSteps) {
    executionSteps = 30; // User provided steps
  }

  // Method Clarity (0 points) - This is derived, not directly from user input
  // We keep this for display purposes but it's always 0 since we don't track it in missingElements
  methodClarity = 0;

  // Timeline (25 points max)
  // Only give points if user provided timeline (missingElements.timeline = false)
  if (!missingElements.timeline) {
    timeline = 25; // User provided timeline
  }

  // Resources (15 points max)
  // Only give points if user mentioned resources (missingElements.resources = false)
  if (!missingElements.resources) {
    resources = 15; // User mentioned resources
  }

  // Total: 30 + 30 + 0 + 25 + 15 = 100
  const total = goalDefinition + executionSteps + methodClarity + timeline + resources;

  return {
    goalDefinition,
    executionSteps,
    methodClarity,
    timeline,
    resources,
    total: Math.min(100, Math.max(0, total)),
  };
}

export function getScoreInterpretation(score: number): string {
  if (score >= 90) {
    return "Excellent - Your plan is well-structured and ready to execute!";
  } else if (score >= 70) {
    return "Good - Minor gaps to address before execution.";
  } else if (score >= 50) {
    return "Fair - Needs more detail and structure.";
  } else if (score >= 30) {
    return "Limited - Significant planning needed.";
  } else {
    return "Poor - Requires complete restructuring.";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) {
    return "text-green-500";
  } else if (score >= 70) {
    return "text-blue-500";
  } else if (score >= 50) {
    return "text-yellow-500";
  } else if (score >= 30) {
    return "text-orange-500";
  } else {
    return "text-red-500";
  }
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) {
    return "bg-green-500";
  } else if (score >= 70) {
    return "bg-blue-500";
  } else if (score >= 50) {
    return "bg-yellow-500";
  } else if (score >= 30) {
    return "bg-orange-500";
  } else {
    return "bg-red-500";
  }
}
