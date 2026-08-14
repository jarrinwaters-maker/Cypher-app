# 📰 News API Setup Guide (NewsAPI + GNews)

## ✅ Implementation Complete!

Both NewsAPI.org and GNews API are now integrated with automatic 48-hour filtering.

## 🔧 Backend Setup

### 1. Get API Keys

#### NewsAPI.org:
1. Go to https://newsapi.org/register
2. Sign up for a free account
3. Copy your API key

#### GNews API:
1. Go to https://gnews.io/api
2. Sign up for a free account
3. Copy your API key

**Free Tier Limits:**
- **NewsAPI**: 100 requests/day (development only)
- **GNews**: 100 requests/day (free tier)

### 2. Add API Keys to Backend

Add these lines to your `c705-backend/.env` file:

```
NEWS_API_KEY=your_newsapi_key_here
GNEWS_API_KEY=your_gnews_key_here
```

**Note**: You can use just one API if you prefer. The system will:
- Try NewsAPI first
- Fall back to GNews if NewsAPI fails
- Combine results from both if both are configured

### 3. Restart Backend

After adding the API keys, restart your backend server:

```bash
cd c705-backend
npm run start:dev
```

## 📱 How It Works

### Automatic 48-Hour Filtering:

✅ **All articles are automatically filtered to the last 48 hours**
✅ **Articles are sorted by date (newest first)**
✅ **Duplicate articles are removed**
✅ **Results are cached for 30 minutes**

### Tab Behavior:

1. **"All" Tab**: 
   - Shows C705 journalist articles
   - PLUS external hip-hop news from last 48 hours
   - Combined and sorted by date

2. **"C705 Articles" Tab**: 
   - Shows only articles created by journalists in your app
   - No time restriction (shows all journalist articles)

3. **"Latest News" Tab**: 
   - Shows ONLY external hip-hop news from the last 48 hours
   - Fetched from NewsAPI and/or GNews
   - Automatically updates when you open the tab

### Features:

✅ **Dual API Support**: Uses both NewsAPI and GNews for better coverage
✅ **Automatic Fallback**: If one API fails, the other is used
✅ **48-Hour Filter**: Only shows articles from the last 48 hours
✅ **No Duplicates**: Removes duplicate articles by URL
✅ **Cached Results**: 30-minute cache reduces API calls
✅ **Search Support**: Works with the search bar
✅ **Secure**: API keys stored on backend only

## 🧪 Testing

1. Start your backend with API keys set
2. Open the app and navigate to the "Articles" tab
3. Switch to "Latest News" tab - you should see articles from the last 48 hours
4. Switch to "All" tab - you should see both journalist articles and external news
5. Try searching for keywords like "hip hop", "rap", "album"

## ⚠️ Important Notes

- **48-Hour Window**: Only articles published in the last 48 hours are shown
- **No Full Content**: We only store summaries and links (legal requirement)
- **Source Credit**: All articles show the original source
- **External Links**: Tapping an external article opens it in Safari
- **Rate Limits**: Free tiers have 100 requests/day - cache helps reduce usage
- **Automatic Refresh**: Articles refresh when you switch tabs or search

## 🔍 API Query Details

The system searches for articles matching:
- "hip hop OR rap OR hiphop OR rap music"
- Plus any search query you enter
- Filtered to English language
- Sorted by publication date (newest first)

## 🚀 Next Steps (Optional)

- Add city-based filtering for news
- Allow admins to curate/feature articles
- Add push notifications for breaking news
- Integrate with artist profiles
- Add article categories/tags

