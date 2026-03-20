# Explain My Plan - AI Clarity & Structuring Tool

A web application that converts unstructured ideas and plans into clear, actionable formats using AI. Built with Next.js, Groq AI, and Firebase.

## Live Demo

[View Live Application](https://your-vercel-deployment-url.vercel.app)

## Features

- **AI Structuring Engine**: Converts free-form text into structured components (Goal, Method, Steps, Timeline)
- **Missing Elements Detection**: Identifies gaps in goal clarity, execution steps, resources, and timeline
- **Clarity Score (0-100)**: Quantifies plan quality based on 5 dimensions
- **Simplified Version**: Generates a concise, clearer version of the input
- **Actionable Steps**: Provides 3-5 practical next steps based on the analysis
- **Iteration Capability**: Modify input and re-run analysis to see improvements
- **History Panel**: Access previous analyses with localStorage fallback

## Tech Stack (All Free Resources)

| Service | Free Tier | Usage |
|---------|-----------|-------|
| **Vercel** | Hobby Plan | Frontend + API hosting |
| **Groq API** | 1M tokens/day | LLM inference (Llama 3.1 70B) |
| **Firebase** | Spark Plan | Database + Auth |

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/explain-my-plan.git
cd explain-my-plan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Groq API Configuration
# Get your free API key from: https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key_here

# Firebase Configuration (Optional - app works with localStorage fallback)
# Create a free Firebase project at: https://console.firebase.google.com/
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
```

## Prompt Design Explanation

The AI prompting strategy uses a multi-layered approach:

### 1. System Prompt
Defines the AI's role as a "plan structuring assistant" and specifies the exact JSON output format required.

### 2. Few-Shot Examples
Includes 2-3 examples of input/output pairs to guide the AI's understanding of the task.

### 3. Structured Output
Enforces JSON format with specific fields:
- `structuredOutput`: Contains goal, method, steps, timeline, simplifiedVersion
- `missingElements`: Boolean flags for goalClarity, executionSteps, resources, timeline
- `actionableSteps`: Array of practical next steps

### 4. Chain-of-Thought
The AI is instructed to:
1. Extract core components from the input
2. Identify missing elements
3. Generate a simplified version
4. Create actionable steps

## Clarity Score Logic

The scoring algorithm evaluates 5 dimensions with weighted points:

| Dimension | Weight | Criteria |
|-----------|--------|----------|
| Goal Definition | 30% | Specific, measurable, achievable goal |
| Execution Steps | 25% | Clear, sequential actions identified |
| Method Clarity | 20% | Approach is understandable |
| Timeline | 15% | Time-bound elements present |
| Resources | 10% | Required resources mentioned |

### Score Interpretation
- **90-100**: Excellent - Ready to execute
- **70-89**: Good - Minor gaps to address
- **50-69**: Fair - Needs more detail
- **0-49**: Poor - Requires significant restructuring

### Deductions
- -10 points: Goal is vague/generic
- -5 points per missing critical element

## Project Structure

```
my-app/
├── app/
│   ├── api/analyze/        # AI analysis API endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── InputSection.tsx    # Text input component
│   ├── AnalysisResult.tsx  # Display structured output
│   ├── ClarityScore.tsx    # Score visualization
│   ├── MissingElements.tsx # Gap analysis display
│   ├── ActionableSteps.tsx # Next steps list
│   └── HistoryPanel.tsx    # Past analyses
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── prompt.ts           # AI prompt templates
│   ├── clarityScore.ts     # Scoring logic
│   ├── groq.ts             # Groq API client
│   └── firebase.ts         # Firebase configuration
├── types/
│   └── index.ts            # TypeScript interfaces
└── .env.local              # Environment variables
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Free Tier Limits

| Service | Limit | Mitigation |
|---------|-------|------------|
| Groq API | 1M tokens/day | Rate limiting, response caching |
| Firebase | 50K reads/day | Pagination, localStorage fallback |
| Vercel | 100GB bandwidth | Image optimization |

## Challenges Faced & Approach

### Challenge 1: AI Response Consistency
**Problem**: LLM responses can be inconsistent in format.
**Solution**: Used structured JSON output with strict system prompts and few-shot examples. Added error handling with fallback mechanisms.

### Challenge 2: Free Tier Limitations
**Problem**: Need to stay within free tier limits while providing good UX.
**Solution**: Implemented localStorage fallback for Firebase, optimized prompts to reduce token usage, and added client-side caching.

### Challenge 3: Clarity Score Accuracy
**Problem**: Ensuring the score reflects actual plan quality.
**Solution**: Designed a weighted scoring system based on 5 dimensions. Validated against multiple test cases to ensure scores align with human judgment.

## License

MIT License - feel free to use this project for your own assignments or learning.

---

Built with Next.js, Groq AI, and Firebase. All resources used are free-tier compatible.
