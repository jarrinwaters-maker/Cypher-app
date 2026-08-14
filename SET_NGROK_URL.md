# How to Set Your Ngrok URL in the App

## Quick Method: Update c705App.swift

1. **Get your ngrok URL** from the ngrok terminal output
   - Look for the line that says: `Forwarding   https://xxxxx.ngrok.app -> http://localhost:3000`
   - Copy the `https://xxxxx.ngrok.app` part

2. **Open** `c705/c705/c705App.swift`

3. **Find** the commented line in the `init()` method:
   ```swift
   // UserDefaults.standard.set("https://your-ngrok-url.ngrok.app", forKey: "customBackendURL")
   ```

4. **Uncomment and update** it with your actual ngrok URL:
   ```swift
   UserDefaults.standard.set("https://xxxxx.ngrok.app", forKey: "customBackendURL")
   ```
   (Replace `xxxxx.ngrok.app` with your actual ngrok URL)

5. **Rebuild and run** the app

## Alternative: Xcode Debugger (No Code Changes)

1. **Set a breakpoint** in `APIService.swift` at line 26 (inside the `baseURL` getter)

2. **Run the app** and when it breaks, type in the console:
   ```swift
   UserDefaults.standard.set("https://xxxxx.ngrok.app", forKey: "customBackendURL")
   ```
   (Replace with your actual ngrok URL)

3. **Continue execution**

4. **Try Apple Sign In again**

## Verify It's Set

Add a breakpoint in `APIService.swift` at line 77 (in `getBaseURL()`) and check:
```swift
po APIService.shared.getBaseURL()
```

Should show your ngrok URL, not `http://10.0.0.215:3000`

## Important Notes

- **Ngrok URL changes** each time you restart ngrok (free accounts)
- You'll need to **update the URL** each time you restart ngrok
- For **production**, deploy to a service like Render or Railway for a permanent URL
