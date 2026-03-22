import Groq from "groq-sdk";
import { SYSTEM_PROMPT } from "./prompt";
import { StructuredOutput, MissingElements, QualityIndicators, AIParsedResponse } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface AIAnalysisResponse {
  structuredOutput: StructuredOutput;
  missingElements: MissingElements;
  actionableSteps: string[];
  clarityScore: number; // From AI
  inputQuality?: "vague" | "partial" | "clear" | "complete";
}

interface RawAIResponse {
  inputQuality?: "vague" | "partial" | "clear" | "complete";
  structuredOutput?: Partial<StructuredOutput>;
  missingElements?: Partial<MissingElements>;
  clarityScore?: number;
  actionableSteps?: string[];
}

/**
 * Validates and sanitizes the AI response to ensure all required fields exist
 */
function validateAndSanitizeResponse(raw: RawAIResponse): AIAnalysisResponse {
  const structured = raw.structuredOutput || {};
  
  // Validate missingElements - ensure all are boolean
  const missingElements = {
    goalClarity: raw.missingElements?.goalClarity ?? true,
    executionSteps: raw.missingElements?.executionSteps ?? true,
    resources: raw.missingElements?.resources ?? true,
    timeline: raw.missingElements?.timeline ?? true,
  };
  
  // Calculate what score SHOULD be based on strict deduction rules
  const expectedScore = (
    (!missingElements.goalClarity ? 30 : 0) +
    (!missingElements.executionSteps ? 30 : 0) +
    (!missingElements.timeline ? 25 : 0) +
    (!missingElements.resources ? 15 : 0)
  );
  
  // Get AI's provided score for reference
  const aiScore = typeof raw.clarityScore === 'number' ? raw.clarityScore : expectedScore;

  // ALWAYS use strict calculation based on missingElements - NO EXCEPTIONS
  // This ensures the displayed score matches the breakdown components
  const finalScore = expectedScore;

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
    clarityScore: finalScore,
    inputQuality: raw.inputQuality || "vague",
  };
}

/**
 * Analyzes quality indicators from the input and response
 */
function analyzeQualityIndicators(input: string, response: AIAnalysisResponse): QualityIndicators {
  const hasSpecificMetrics = /\$|\d+%|\d+\/|\d+x/i.test(input);
  const hasDeadlines = /\d+\s*(days?|weeks?|months?|years?)|by\s+\w+\s+\d+|within|deadline/i.test(input);
  const hasResourceInventory = /\b(have|own|budget|\$\d+|certification|degree|experience)\b/i.test(input);
  const hasPhasedApproach = /\b(phase|stage|step \d+|week \d+|month \d+|first|then|finally)\b/i.test(input);
  
  const presentCount = [hasSpecificMetrics, hasDeadlines, hasResourceInventory, hasPhasedApproach]
    .filter(Boolean).length;
  
  let inputQualityLevel: 'low' | 'medium' | 'high' = 'low';
  if (presentCount >= 3) inputQualityLevel = 'high';
  else if (presentCount >= 2) inputQualityLevel = 'medium';
  
  return {
    hasSpecificMetrics,
    hasDeadlines,
    hasResourceInventory,
    hasPhasedApproach,
    inputQualityLevel,
  };
}

export async function analyzePlan(input: string): Promise<AIAnalysisResponse & { qualityIndicators?: QualityIndicators }> {
  try {
    // Validate input
    if (!input || typeof input !== "string" || input.trim().length === 0) {
      throw new Error("Input must be a non-empty string");
    }

    if (input.length > 5000) {
      throw new Error("Input exceeds maximum length of 5000 characters");
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Analyze this plan and provide structured output in JSON format:\n\n"${input}"`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.2, // Even lower for strict deterministic responses
      max_tokens: 4000,
      top_p: 0.9,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI model");
    }

    let parsedResponse: RawAIResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid JSON response from AI. Please try again.");
    }
    
    // Validate and sanitize the response
    const sanitizedResponse = validateAndSanitizeResponse(parsedResponse);
    
    // Analyze quality indicators
    const qualityIndicators = analyzeQualityIndicators(input, sanitizedResponse);
    
    // Log analysis metadata for debugging
    console.log("Analysis completed:", {
      qualityLevel: qualityIndicators.inputQualityLevel,
      aiInputQuality: sanitizedResponse.inputQuality,
      clarityScore: sanitizedResponse.clarityScore,
      missingElements: sanitizedResponse.missingElements,
      missingElementsCount: Object.values(sanitizedResponse.missingElements).filter(Boolean).length,
      rawResponse: parsedResponse,
    });

    return {
      ...sanitizedResponse,
      qualityIndicators,
    };
  } catch (error) {
    console.error("Error analyzing plan:", error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Groq API key is missing or invalid. Please check your environment variables.");
      }
      if (error.message.includes("rate limit") || error.message.includes("quota")) {
        throw new Error("API rate limit exceeded. Please wait a moment and try again.");
      }
      if (error.message.includes("Invalid JSON")) {
        throw new Error("Failed to parse AI response. This can happen with very short inputs. Try adding more details.");
      }
    }
    
    throw new Error("Failed to analyze plan. Please verify your input and try again.");
  }
}
