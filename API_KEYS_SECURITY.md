# 🔒 API Key Security Guide

## ✅ Your API Keys Are Secure!

This project follows best practices for API key management. All sensitive credentials are stored in `.env.local`, which is **never committed to Git**.

---

## 📁 How API Keys Are Protected

### **`.gitignore` Configuration:**

```
.env*
!.env.example
```

This ensures:
- ✅ `.env.local` (your real keys) → **NEVER committed**
- ✅ `.env.example` (template) → **Safe to commit**

---

## 🔑 Required API Keys

To run this project, you'll need API keys from the following services:

### 1. **Groq AI** (Required)
- **Purpose**: Fast AI analysis of your plans
- **Get Free Key**: https://console.groq.com/keys
- **Environment Variable**: `GROQ_API_KEY`

### 2. **Google Gemini** (Optional)
- **Purpose**: Alternative AI provider for detailed analysis
- **Get Free Key**: https://makersuite.google.com/app/apikey
- **Environment Variable**: `GEMINI_API_KEY`

### 3. **Firebase** (Optional - for data persistence)
- **Purpose**: Cloud storage for analysis history
- **Get Free Config**: https://console.firebase.google.com/
- **Environment Variables**: 
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 🚀 Setup Instructions

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/KaranamSrivatsa/Kalnet.git
cd Kalnet/kalnetProject/my-app
```

### **Step 2: Create Environment File**

```bash
cp .env.example .env.local
```

### **Step 3: Add Your API Keys**

Edit `.env.local`:

```bash
# Groq API Configuration
GROQ_API_KEY=your_actual_groq_key_here

# Gemini AI Configuration (Optional)
GEMINI_API_KEY=your_actual_gemini_key_here

# Firebase Configuration (Optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Step 4: Install Dependencies**

```bash
npm install
```

### **Step 5: Run Development Server**

```bash
npm run dev
```

Visit http://localhost:3000

---

## 🔐 Security Best Practices

### ✅ **DO:**

1. **Keep `.env.local` private** - Never share or commit it
2. **Use environment variables** - Never hardcode keys in source code
3. **Rotate keys periodically** - Generate new keys every few months
4. **Use separate keys for dev/prod** - Don't use production keys locally
5. **Enable GitHub Secret Scanning** - Protects against accidental exposure

### ❌ **DON'T:**

1. **Don't commit `.env.local`** - It's gitignored for a reason
2. **Don't share API keys publicly** - Treat them like passwords
3. **Don't commit real keys** - Even in private repos
4. **Don't use someone else's keys** - Get your own free keys
5. **Don't paste keys in chat/logs** - Use environment variables

---

## 🛡️ If You Accidentally Exposed a Key

### **Immediate Actions:**

1. **Delete the commit** (if not pushed):
   ```bash
   git reset --hard HEAD~1
   ```

2. **If already pushed**, remove from history:
   ```bash
   # Install BFG Repo-Cleaner
   bfg --delete-files .env.local
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

3. **Rotate the exposed key immediately**:
   - Go to the service's console
   - Delete the old key
   - Generate a new key
   - Update `.env.local`

4. **Check GitHub Security**:
   - Go to repo Settings > Code security & analysis
   - Review secret scanning alerts

---

## 📊 Current Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Groq Integration | ✅ Working | Requires API key |
| Gemini Integration | ✅ Working | Optional alternative |
| Firebase Storage | ✅ Working | Optional persistence |
| LocalStorage Fallback | ✅ Working | Works without Firebase |
| API Key Security | ✅ Protected | `.env.local` gitignored |

---

## 🎯 For Production Deployment

### **Vercel Deployment:**

1. Push code to GitHub (without `.env.local`)
2. Go to Vercel Dashboard
3. Import your GitHub repo
4. Add environment variables in Vercel settings:
   - `GROQ_API_KEY`
   - `GEMINI_API_KEY` (optional)
   - Firebase vars (optional)
5. Deploy!

### **Environment-Specific Keys:**

- **Development**: Use free tier keys
- **Production**: Use production-grade keys with higher limits
- **Staging**: Use separate test keys

---

## 📞 Support & Resources

### **Get Help:**

- **Groq Docs**: https://console.groq.com/docs
- **Gemini Docs**: https://ai.google.dev/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Env**: https://nextjs.org/docs/basic-features/environment-variables

### **Report Security Issues:**

If you find a security vulnerability, please report it privately to the repository maintainer.

---

## ✨ Summary

Your API keys are **secure by default** in this project:

✅ `.env.local` stores your real keys (gitignored)  
✅ `.env.example` provides a template (safe to commit)  
✅ No keys hardcoded in source code  
✅ GitHub secret scanning enabled  
✅ Clear setup instructions provided  

**You're all set!** Just add your own API keys to `.env.local` and you're ready to go! 🚀
