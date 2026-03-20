import { NextRequest, NextResponse } from "next/server";
import { analyzePlan } from "@/lib/groq";
import { calculateClarityScore } from "@/lib/clarityScore";
import { saveAnalysis } from "@/lib/firebase";
import { AnalysisResult, QualityIndicators } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return NextResponse.json(
        { error: "Input is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (input.length > 5000) {
      return NextResponse.json(
        { error: "Input must be less than 5000 characters" },
        { status: 400 }
      );
    }

    // Analyze the plan using Groq AI with enhanced strict prompt
    const aiResponse = await analyzePlan(input);

    // STRICT SCORE CALCULATION - Must follow exact deduction rules from prompt
    // Based on missingElements boolean flags (true = missing, false = present)
    const goalPoints = !aiResponse.missingElements.goalClarity ? 30 : 0;
    const stepsPoints = !aiResponse.missingElements.executionSteps ? 30 : 0;
    const timelinePoints = !aiResponse.missingElements.timeline ? 25 : 0;
    const resourcesPoints = !aiResponse.missingElements.resources ? 15 : 0;
    
    let calculatedTotal = goalPoints + stepsPoints + timelinePoints + resourcesPoints;
    
    // ENFORCE STRICT RULES FROM PROMPT:
    // Rule 1: If input is "vague", score MUST be 0-20
    if (aiResponse.inputQuality === "vague") {
      calculatedTotal = Math.min(calculatedTotal, 20);
    }
    
    // Rule 2: If ALL elements are missing, score MUST be 0-20
    const allMissing = Object.values(aiResponse.missingElements).every(v => v === true);
    if (allMissing) {
      calculatedTotal = Math.min(calculatedTotal, 20);
    }
    
    // Rule 3: Ensure score is within valid range
    calculatedTotal = Math.max(0, Math.min(100, calculatedTotal));
    
    // Create score breakdown matching the 4 dimensions
    const scoreBreakdown = {
      goalDefinition: goalPoints,
      executionSteps: stepsPoints,
      methodClarity: 0, // Not tracked in missingElements
      timeline: timelinePoints,
      resources: resourcesPoints,
      total: calculatedTotal,
    };

    // Log for debugging
    console.log("Score calculation:", {
      inputQuality: aiResponse.inputQuality,
      missingElements: aiResponse.missingElements,
      calculatedTotal,
      allMissing,
    });

    // Create analysis result
    const analysisResult: Omit<AnalysisResult, "id"> = {
      originalInput: input,
      structuredOutput: aiResponse.structuredOutput,
      missingElements: aiResponse.missingElements,
      actionableSteps: aiResponse.actionableSteps,
      clarityScore: scoreBreakdown.total,
      createdAt: new Date().toISOString(),
    };

    // Save to database (with localStorage fallback)
    const id = await saveAnalysis(analysisResult);

    // Return enhanced response with quality indicators and input quality
    return NextResponse.json({
      ...analysisResult,
      id,
      scoreBreakdown,
      qualityIndicators: aiResponse.qualityIndicators,
      inputQuality: aiResponse.inputQuality,
    });
  } catch (error) {
    console.error("Error in analyze API:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
