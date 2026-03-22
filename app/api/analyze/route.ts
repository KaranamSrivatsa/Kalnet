import { NextRequest, NextResponse } from "next/server";
import { analyzePlan } from "@/lib/groq";
import { analyzeWithGemini, isGeminiEnabled } from "@/lib/gemini";
import { calculateClarityScore } from "@/lib/clarityScore";
import { saveAnalysis } from "@/lib/firebase";
import { AnalysisResult, QualityIndicators } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, useGroq } = body; // useGroq boolean to toggle between AI providers

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

    // Choose AI provider based on useGroq flag (default to Groq for backward compatibility)
    const shouldUseGroq = useGroq !== false; // Default true if not specified
    
    let aiResponse;
    if (shouldUseGroq) {
      // Analyze with Groq AI
      aiResponse = await analyzePlan(input);
      console.log("Using Groq AI for analysis");
    } else {
      // Analyze with Gemini AI
      if (!isGeminiEnabled()) {
        return NextResponse.json(
          { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file." },
          { status: 503 }
        );
      }
      aiResponse = await analyzeWithGemini(input);
      console.log("Using Gemini AI for analysis");
    }

    // Use EXACT clarity score from AI - NO FALLBACKS OR OVERRIDES
    // The AI calculates score based on strict deduction rules in the prompt
    const scoreBreakdown = {
      goalDefinition: !aiResponse.missingElements.goalClarity ? 30 : 0,
      executionSteps: !aiResponse.missingElements.executionSteps ? 30 : 0,
      methodClarity: 0, // Not tracked in missingElements
      timeline: !aiResponse.missingElements.timeline ? 25 : 0,
      resources: !aiResponse.missingElements.resources ? 15 : 0,
      total: aiResponse.clarityScore, // EXACT AI score - trust AI calculation
    };

    // Log for debugging
    console.log("Score calculation:", {
      inputQuality: aiResponse.inputQuality,
      missingElements: aiResponse.missingElements,
      aiProvidedScore: aiResponse.clarityScore,
      breakdownTotal: scoreBreakdown.total,
      allMissing: Object.values(aiResponse.missingElements).every(v => v === true),
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
      qualityIndicators: (aiResponse as any).qualityIndicators, // Only Groq returns this
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
