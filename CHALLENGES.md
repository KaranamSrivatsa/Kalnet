# Challenges Faced & Approach to AI Prompting

## Challenges Faced

### 1. AI Response Consistency
**Challenge**: Large Language Models can produce inconsistent output formats, even with instructions. This made parsing responses difficult.

**Solution**: 
- Used structured JSON output format with strict schema validation
- Implemented few-shot prompting with clear examples
- Added error handling with user-friendly fallback messages
- Set low temperature (0.3) for more deterministic responses

### 2. Free Tier Resource Management
**Challenge**: Staying within free tier limits while providing a good user experience.

**Solution**:
- Implemented localStorage fallback for Firebase operations
- Optimized prompts to reduce token usage
- Added client-side caching for history
- Used efficient data structures to minimize Firestore reads/writes

### 3. Clarity Score Accuracy
**Challenge**: Creating a scoring system that accurately reflects plan quality and aligns with human judgment.

**Solution**:
- Designed a weighted scoring algorithm based on 5 key dimensions
- Validated against multiple test cases
- Made the scoring logic transparent and explainable
- Allowed for partial credit (e.g., goal exists but is vague)

### 4. Real-time Feedback Loop
**Challenge**: Enabling users to iterate and see improvements in their plans.

**Solution**:
- Designed the UI to show before/after comparison
- Implemented history panel for tracking progress
- Made it easy to edit and re-analyze plans
- Showed score improvements between iterations

## Approach to AI Prompting

### Multi-Layer Prompting Strategy

1. **System Prompt**: Defines the AI's role and expected behavior
   - Clear instruction: "You are a plan structuring assistant"
   - Output format specification: JSON structure
   - Task breakdown: Extract components, identify gaps, generate steps

2. **Few-Shot Examples**: Provides concrete examples of input/output pairs
   - Example 1: Vague plan (YouTube channel)
   - Example 2: More detailed plan (Learning Python)
   - Shows the AI what good output looks like

3. **Structured Output**: Enforces consistent format
   - Required fields with types
   - Boolean flags for missing elements
   - Array of actionable steps

4. **Chain-of-Thought**: Guides the AI through reasoning
   - Extract core components first
   - Then identify what's missing
   - Finally generate improvements

### Prompt Engineering Techniques Used

- **Role Assignment**: "You are an expert plan structuring assistant"
- **Format Enforcement**: "Respond ONLY in valid JSON format"
- **Specific Instructions**: Break down tasks into clear steps
- **Examples**: Provide 2-3 diverse examples
- **Constraints**: Set temperature to 0.3 for consistency
- **Error Prevention**: Explicit field descriptions and types

### Why This Approach Works

1. **Consistency**: Few-shot examples and low temperature ensure similar outputs
2. **Completeness**: Structured format forces the AI to address all required fields
3. **Quality**: Chain-of-thought reasoning produces more thoughtful responses
4. **Reliability**: Error handling and fallbacks ensure the app works even when AI is imperfect

## Key Learnings

1. **Prompt design is iterative**: Tested multiple variations to find what works best
2. **Examples matter**: Few-shot prompting significantly improved output quality
3. **Structured output is crucial**: JSON format makes parsing reliable
4. **Fallbacks are essential**: Always have a backup plan when working with external APIs
5. **User experience first**: Even with AI complexity, the UI should be simple and intuitive
