# How to Add Your Background Image

## Quick Steps:

### Option 1: Using Xcode (Recommended)
1. Open your project in Xcode
2. In the Project Navigator, find `Assets.xcassets`
3. You should see a folder called `loginBackground` (already created)
4. Click on `loginBackground`
5. Drag your image file into the image set
   - You can drag one high-resolution image and Xcode will handle scaling
   - Or drag separate images for 1x, 2x, and 3x resolutions

### Option 2: Using Finder
1. Navigate to: `c705/c705/Assets.xcassets/loginBackground.imageset/`
2. Drag your image file(s) into this folder
3. Name them:
   - `loginBackground.png` (for 1x)
   - `loginBackground@2x.png` (for 2x - optional, Xcode can generate)
   - `loginBackground@3x.png` (for 3x - optional, Xcode can generate)
4. Open Xcode and the image should appear automatically

## Image Requirements:
- **Format**: PNG, JPG, or HEIC
- **Recommended Size**: At least 1242x2688 pixels (iPhone Pro Max size)
- **Aspect Ratio**: Any (the code will scale it to fit)

## After Adding:
1. Clean build folder: `Product` → `Clean Build Folder` (Shift+Cmd+K)
2. Rebuild the app: `Product` → `Build` (Cmd+B)
3. Run the app to see your background image!

## Troubleshooting:
- If the image doesn't appear, make sure the file name matches exactly: `loginBackground`
- Check that the image is actually in the `loginBackground.imageset` folder
- Try cleaning the build folder and rebuilding
- Make sure the image file isn't corrupted

