# Audio Playback Setup Guide

## Overview

The audio playback system uses `AVAudioPlayer` with full support for:
- ✅ Background audio playback
- ✅ Bluetooth headphones
- ✅ Lock screen controls
- ✅ Streaming from backend URLs (S3)

## Architecture

### Components

1. **AudioPlayerService** (`Services/AudioPlayerService.swift`)
   - Singleton service managing audio playback
   - Handles AVAudioPlayer lifecycle
   - Configures audio session for background playback
   - Manages lock screen controls
   - Updates now playing info

2. **AudioPlayerViewModel** (`ViewModels/AudioPlayerViewModel.swift`)
   - View model for audio player UI
   - Observes AudioPlayerService state
   - Provides formatted time strings
   - Handles user interactions

3. **AudioPlayerView** (`Views/AudioPlayerView.swift`)
   - Full-featured audio player UI
   - Shows track info, progress, controls
   - Compact version for feed items

## Setup Steps

### 1. Add Background Modes Capability

1. Open Xcode project
2. Select project → Target (c705)
3. Go to "Signing & Capabilities"
4. Click "+ Capability"
5. Add "Background Modes"
6. Check "Audio, AirPlay, and Picture in Picture"

### 2. Import Required Frameworks

Already included in the code:
- `AVFoundation` - Audio playback
- `MediaPlayer` - Lock screen controls

### 3. Usage in Views

```swift
// Full player view
AudioPlayerView(track: track)

// Compact player in feed
CompactAudioPlayerView(track: track)
```

## Features

### Background Audio
- Audio continues playing when app goes to background
- Works when phone is locked
- Audio session configured for background playback

### Lock Screen Controls
- Play/Pause button
- Track title and artist
- Current time / Duration
- Seek slider (via changePlaybackPositionCommand)

### Bluetooth Support
- Works with Bluetooth headphones
- High-quality audio (A2DP)
- Controls work from headphones

### Streaming
- Downloads audio from S3 URL
- Loads into AVAudioPlayer
- Handles network errors gracefully

## Testing

### Test Background Audio
1. Play a track
2. Press home button
3. Audio should continue playing
4. Lock screen should show controls

### Test Headphones
1. Connect Bluetooth headphones
2. Play a track
3. Audio should play through headphones
4. Headphone controls should work

### Test Lock Screen
1. Play a track
2. Lock the phone
3. Lock screen should show:
   - Track title
   - Artist name
   - Play/Pause button
   - Time progress
4. Controls should work

## Audio Session Configuration

```swift
Category: .playback
Mode: .default
Options: [.allowBluetooth, .allowBluetoothA2DP]
```

This configuration:
- Allows background playback
- Supports Bluetooth audio
- Supports high-quality Bluetooth (A2DP)

## Remote Command Center

Enabled commands:
- ✅ Play
- ✅ Pause
- ✅ Toggle Play/Pause
- ✅ Change Playback Position
- ❌ Next Track (disabled)
- ❌ Previous Track (disabled)

## Error Handling

The service handles:
- Invalid URLs
- Network errors
- Audio decode errors
- Interruptions (phone calls, etc.)
- Auto-resume after interruptions

## Performance

- Audio is downloaded and cached in memory
- Uses AVAudioPlayer for efficient playback
- Timer updates UI every 0.1 seconds
- Properly cleans up on stop

## Next Steps

1. Add Info.plist background mode
2. Test on device (simulator has limitations)
3. Add queue/playlist functionality (optional)
4. Add shuffle/repeat modes (optional)
5. Add volume control (optional)

