# 📰 Hip-Hop News API Setup Guide

## ✅ Implementation Complete!

The news service has been fully integrated into your C705 app.

## 🔧 Backend Setup

### 1. Get Your NewsAPI Key

1. Go to https://newsapi.org/register
2. Sign up for a free account
3. Copy your API key

### 2. Add API Key to Backend

Add this line to your `c705-backend/.env` file:

```
NEWS_API_KEY=your_api_key_here
```

**Free Tier Limits:**
- 100 requests per day
- Development/testing only
- For production, upgrade to a paid plan

### 3. Restart Backend

After adding the API key, restart your backend server:

```bash
cd c705-backend
npm run start:dev
```

## 📱 How It Works

### Tab Behavior:

1. **"All" Tab**: Shows both C705 journalist articles AND external hip-hop news
2. **"C705 Articles" Tab**: Shows only articles created by journalists in your app
3. **"Latest News" Tab**: Shows only external hip-hop news from the web

### Features:

✅ **Secure**: API key stored on backend, never exposed to iOS
✅ **Cached**: Results cached for 30 minutes to reduce API calls
✅ **Legal**: Only shows summaries + links (no full content storage)
✅ **App Store Safe**: Credits sources, links to originals
✅ **Search**: Works with the search bar to filter articles

## 🧪 Testing

1. Start your backend with the API key set
2. Open the app and navigate to the "Articles" tab
3. Switch between "All", "C705 Articles", and "Latest News"
4. Try searching for keywords like "hip hop", "rap", "album"

## ⚠️ Important Notes

- **No Full Content**: We only store summaries and links (legal requirement)
- **Source Credit**: All articles show the original source
- **External Links**: Tapping an external article opens it in Safari
- **Rate Limits**: Free tier has 100 requests/day - cache helps reduce usage

## 🚀 Next Steps (Optional)

- Add city-based filtering for news
- Allow admins to curate/feature articles
- Add push notifications for breaking news
- Integrate with artist profiles

