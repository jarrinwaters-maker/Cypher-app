# Info.plist Setup for Background Audio

## Required Configuration

To enable background audio playback, you need to add the following to your `Info.plist` file:

### Steps:

1. **Open your Xcode project**
2. **Select the project** in the Project Navigator
3. **Select your target** (c705)
4. **Go to the "Signing & Capabilities" tab**
5. **Click "+ Capability"**
6. **Add "Background Modes"**
7. **Check "Audio, AirPlay, and Picture in Picture"**

### Alternative: Manual Info.plist Edit

If you prefer to edit `Info.plist` directly, add:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

### Required Imports

The AudioPlayerService already includes:
- `AVFoundation` - For AVAudioPlayer and AVAudioSession
- `MediaPlayer` - For lock screen controls (MPRemoteCommandCenter, MPNowPlayingInfoCenter)

### Capabilities Summary

✅ **Background Audio** - Enabled via Info.plist
✅ **Bluetooth Audio** - Configured in audio session
✅ **Lock Screen Controls** - Implemented via MPRemoteCommandCenter
✅ **Headphones Support** - Configured with `.allowBluetooth` and `.allowBluetoothA2DP`

## Testing Checklist

### Background Audio
- [ ] Play a track
- [ ] Press home button (app goes to background)
- [ ] Audio continues playing
- [ ] Lock screen shows controls

### Headphones
- [ ] Connect Bluetooth headphones
- [ ] Play audio
- [ ] Audio plays through headphones
- [ ] Controls work from headphones

### Phone Locked
- [ ] Play a track
- [ ] Lock the phone
- [ ] Lock screen shows track info
- [ ] Play/pause controls work
- [ ] Seek controls work

## Audio Session Configuration

The audio session is configured with:
- **Category:** `.playback` - Allows background audio
- **Mode:** `.default` - Standard playback mode
- **Options:** 
  - `.allowBluetooth` - Bluetooth audio support
  - `.allowBluetoothA2DP` - High-quality Bluetooth audio

## Lock Screen Controls

The following controls are enabled:
- ✅ Play
- ✅ Pause
- ✅ Toggle Play/Pause
- ✅ Seek (change playback position)
- ❌ Next Track (disabled)
- ❌ Previous Track (disabled)

## Now Playing Info

The lock screen displays:
- Track title
- Artist name
- Current time / Duration
- Playback progress

