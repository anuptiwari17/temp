# Query

## What it does

- Ask questions in any field  
- Select AI models of your choice  
- Switch between **Study Mode** and **Research Mode**  
- Enable **Web Mode** for more accurate, up-to-date answers  
- Get citations and sources  

## 🚀 How to use

1. Open the platform:  
   👉 [https://query-delta.vercel.app](https://query-delta.vercel.app)  
2. Type your question  
3. Select the AI model and mode  
4. Receive instant AI-powered answers with sources  

## 🛠️ Built with

- Next.js  
- Gemini APIs  
- OpenRouter  
- NVIDIA Models  

## 🔑 Environment Variables

To run this project locally or deploy it, you need to set the following environment variables:

### Clerk Keys
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  
- `CLERK_SECRET_KEY`  
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`  
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`  
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`  
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`  

### Supabase Keys
- `NEXT_PUBLIC_SUPABASE_URL`  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  

### How to set
1. Create a `.env.local` file in the root of the project.  
2. Add the keys like this:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=your_sign_in_url_here
NEXT_PUBLIC_CLERK_SIGN_UP_URL=your_sign_up_url_here
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=your_sign_in_fallback_url_here
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=your_sign_up_fallback_url_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Restart your server :
```
npm run dev
```
