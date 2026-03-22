// Google Generative AI (Gemini) configuration
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIParsedResponse } from "../types";
import { SYSTEM_PROMPT } from "./prompt";

const API_KEY = process.env.GEMINI_API_KEY || "";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

export function isGeminiEnabled(): boolean {
  return !!API_KEY && API_KEY.length > 0;
}

/**
 * Analyze plan using Google's Gemini AI
 */
export async function analyzeWithGemini(input: string): Promise<AIParsedResponse> {
  if (!isGeminiEnabled()) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${SYSTEM_PROMPT}

USER INPUT TO ANALYZE:
"${input}"

Respond ONLY with valid JSON in this exact format:
{
  "inputQuality": "vague" | "partial" | "clear" | "complete",
  "structuredOutput": {
    "goal": "string",
    "method": "string",
    "steps": ["step 1", "step 2", "step 3"],
    "timeline": "string",
    "simplifiedVersion": "string"
  },
  "missingElements": {
    "goalClarity": boolean,
    "executionSteps": boolean,
    "resources": boolean,
    "timeline": boolean
  },
  "clarityScore": number,
  "actionableSteps": ["step 1", "step 2", "step 3", "step 4", "step 5"]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    
    const rawResponse = JSON.parse(jsonString);

    // Validate and sanitize response
    return validateAndSanitizeGeminiResponse(rawResponse);
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    throw new Error(`Failed to analyze with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validates and sanitizes Gemini AI response
 */
function validateAndSanitizeGeminiResponse(raw: any): AIParsedResponse {
  const structured = raw.structuredOutput || {};
  
  // Validate missingElements - ensure all are boolean
  const missingElements = {
    goalClarity: raw.missingElements?.goalClarity ?? true,
    executionSteps: raw.missingElements?.executionSteps ?? true,
    resources: raw.missingElements?.resources ?? true,
    timeline: raw.missingElements?.timeline ?? true,
  };
  
  // Calculate score based on strict deduction rules
  const expectedScore = (
    (!missingElements.goalClarity ? 30 : 0) +
    (!missingElements.executionSteps ? 30 : 0) +
    (!missingElements.timeline ? 25 : 0) +
    (!missingElements.resources ? 15 : 0)
  );

  return {
    structuredOutput: {
      goal: structured.goal?.trim() || "Goal not clearly defined - consider specifying what success looks like with measurable outcomes",
      method: structured.method?.trim() || "Method not specified - research proven frameworks and approaches for your goal",
      steps: structured.steps && Array.isArray(structured.steps) && structured.steps.length > 0 
        ? structured.steps
            .map((s: any) => typeof s === 'string' ? s.trim() : '')
            .filter((s: string) => s.length > 0)
        : [
            "Define your goal clearly with specific metrics and deadlines",
            "Research the best approach or framework used by successful people",
            "Break down the goal into smaller, manageable tasks",
            "Identify and gather necessary resources (tools, budget, skills)",
            "Create a timeline with milestones and accountability checkpoints"
          ],
      timeline: structured.timeline?.trim() || "No timeline provided - set specific deadlines and milestones for each phase",
      simplifiedVersion: structured.simplifiedVersion?.trim() || "Clear mission statement pending - define your core objective in one sentence",
    },
    missingElements,
    actionableSteps: raw.actionableSteps && Array.isArray(raw.actionableSteps) && raw.actionableSteps.length > 0
      ? raw.actionableSteps
          .map((s: any) => typeof s === 'string' ? s.trim() : '')
          .filter((s: string) => s.length > 0)
          .slice(0, 5)
      : [
          "Write down your goal with specific metrics and a deadline",
          "Research 3 people who achieved similar goals and note their approach",
          "List all resources you currently have and those you need",
          "Create a simple timeline with 3 major milestones",
          "Share your plan with someone for accountability"
        ],
    clarityScore: Math.max(0, Math.min(100, expectedScore)), // Ensure 0-100 range
    inputQuality: raw.inputQuality || "partial",
  };
}
