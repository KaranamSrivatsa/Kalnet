# Gemini AI Integration Guide

## ✅ Dual AI Provider Support

Your project now supports **both Groq and Gemini AI** with a simple boolean toggle!

---

## 🎯 How to Use

### **API Request Format:**

```typescript
// Use Groq AI (default - backward compatible)
POST /api/analyze
{
  "input": "I want to learn React Native in 90 days",
  "useGroq": true  // or omit this field (defaults to true)
}

// Use Gemini AI
POST /api/analyze
{
  "input": "I want to learn React Native in 90 days",
  "useGroq": false  // Switches to Gemini
}
```

### **Frontend Example:**

```typescript
// Call API with Groq
const analyzeWithGroq = async (input: string) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      input,
      useGroq: true  // Use Groq
    }),
  });
  return response.json();
};

// Call API with Gemini
const analyzeWithGemini = async (input: string) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      input,
      useGroq: false  // Use Gemini
    }),
  });
  return response.json();
};
```

---

## 🔧 Configuration

### **Environment Variables:**

Add to `.env.local`:

```bash
# Groq API Key (required for Groq)
GROQ_API_KEY=your_groq_api_key_here

# Gemini API Key (required for Gemini)
GEMINI_API_KEY=AIzaSyBTruUYCle0kDXX4vGv_VOlJj_X0P_XE9k
```

### **Get Your Keys:**

- **Groq**: https://console.groq.com/keys (Free tier available)
- **Gemini**: https://makersuite.google.com/app/apikey (Free tier available)

---

## 📊 Comparison Table

| Feature | Groq AI | Gemini AI |
|---------|---------|-----------|
| **Speed** | ⚡ Very Fast | 🐢 Moderate |
| **Model** | Llama 3.1-8B | Gemini Pro |
| **Cost** | Free tier available | Free tier available |
| **Context Window** | 8K tokens | 32K tokens |
| **Best For** | Quick analysis, real-time | Complex reasoning, detailed output |

---

## 🏗️ Architecture

### **Files Added/Modified:**

```
lib/
├── groq.ts          # Groq AI integration (existing)
├── gemini.ts        # ✨ NEW - Gemini AI integration
└── prompt.ts        # Shared system prompt

app/api/analyze/
└── route.ts         # Updated with useGroq toggle

.env.local           # Updated with GEMINI_API_KEY
.env.example         # Updated template
package.json         # Added @google/generative-ai
```

### **How It Works:**

```
User Request
    ↓
Check useGroq flag
    ↓
    ├─ true (or undefined) → Groq AI → Analysis Result
    └─ false → Gemini AI → Analysis Result
    ↓
Same strict scoring logic (30+30+25+15 formula)
    ↓
Consistent output format regardless of provider
```

---

## ✅ Testing

### **Test with Groq:**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I want to lose 20 pounds in 90 days",
    "useGroq": true
  }'
```

### **Test with Gemini:**

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "input": "I want to lose 20 pounds in 90 days",
    "useGroq": false
  }'
```

---

## 🎛️ UI Toggle Implementation (Optional)

If you want to add a UI toggle for users to switch between AI providers:

```tsx
// components/AIProviderToggle.tsx
import { useState } from 'react';

interface AIProviderToggleProps {
  onProviderChange?: (useGroq: boolean) => void;
}

export function AIProviderToggle({ onProviderChange }: AIProviderToggleProps) {
  const [useGroq, setUseGroq] = useState(true);

  const handleToggle = () => {
    const newValue = !useGroq;
    setUseGroq(newValue);
    onProviderChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className={`text-sm ${useGroq ? 'font-bold' : ''}`}>🚀 Groq</span>
      <button
        onClick={handleToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          useGroq ? 'bg-blue-500' : 'bg-purple-500'
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            useGroq ? 'left-1' : 'right-1'
          }`}
        />
      </button>
      <span className={`text-sm ${!useGroq ? 'font-bold' : ''}`}>💎 Gemini</span>
    </div>
  );
}
```

---

## 🔍 Error Handling

### **Gemini Not Configured:**

If `GEMINI_API_KEY` is missing and user requests Gemini:

```json
{
  "error": "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file."
}
```

### **Solution:**
1. Add `GEMINI_API_KEY` to `.env.local`
2. Restart dev server: `npm run dev`

---

## 📦 Dependencies

### **Installed:**

```json
{
  "@google/generative-ai": "^0.x.x"
}
```

### **Already Installed:**

```json
{
  "groq-sdk": "^1.1.1"
}
```

---

## 🚀 Deployment to Vercel

### **Add Environment Variables:**

In Vercel Dashboard → Project Settings → Environment Variables:

1. `GROQ_API_KEY` = your_groq_key
2. `GEMINI_API_KEY` = your_gemini_key

Then redeploy!

---

## 🎯 Benefits

✅ **Flexibility**: Choose the best AI for your needs  
✅ **Cost Control**: Use free tiers of both providers  
✅ **Performance**: Groq for speed, Gemini for depth  
✅ **Redundancy**: Fallback option if one service is down  
✅ **Testing**: Compare outputs between providers  

---

## 📝 Usage Examples

### **Example 1: Quick Analysis (Groq)**
```typescript
const result = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({
    input: "Start a business",
    useGroq: true  // Fast response
  })
});
```

### **Example 2: Detailed Analysis (Gemini)**
```typescript
const result = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({
    input: "Create a comprehensive 5-year career transition plan into data science",
    useGroq: false  // More detailed reasoning
  })
});
```

### **Example 3: Default Behavior (Backward Compatible)**
```typescript
const result = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({
    input: "Learn Python in 6 months"
    // useGroq omitted - defaults to Groq
  })
});
```

---

## 🔮 Future Enhancements

- [ ] Auto-select best provider based on input complexity
- [ ] Cost tracking per provider
- [ ] Response time monitoring
- [ ] Quality comparison metrics
- [ ] Hybrid approach (both providers, compare results)

---

## 📞 Support

**Issues?**
- Check that API keys are valid
- Ensure environment variables are loaded
- Review console logs for specific errors
- Test each provider separately first

**GitHub Issues:** https://github.com/KaranamSrivatsa/Kalnet/issues

---

## ✅ Summary

✨ **You now have dual AI power!**

- **Default**: Groq (fast, reliable)
- **Alternative**: Gemini (detailed, thoughtful)
- **Toggle**: Simple boolean flag (`useGroq`)
- **Same Output**: Consistent scoring & format
- **Easy Setup**: Just add API keys

🚀 **Ready to analyze with both Groq and Gemini!**
