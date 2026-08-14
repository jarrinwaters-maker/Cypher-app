# Background Image Setup Guide

## Adding the Background Image

To use your image as the background for login/signup pages:

### Step 1: Add Image to Assets

1. Open Xcode
2. Navigate to your project
3. Open `Assets.xcassets` (or create it if it doesn't exist)
4. Right-click in the Assets catalog → **New Image Set**
5. Name it: `loginBackground`
6. Drag your image file into the image set
7. Make sure it's added for all sizes (1x, 2x, 3x if needed)

### Step 2: Image File Location

Place your image file in one of these locations:
- `c705/c705/Assets.xcassets/loginBackground.imageset/`
- Or drag it directly into Xcode's Assets catalog

### Step 3: Image Requirements

- **Format**: PNG, JPEG, or HEIC
- **Recommended size**: At least 1242x2688 pixels (iPhone Pro Max size)
- **Aspect ratio**: 9:19.5 (iPhone standard) or 9:16
- **File name**: The image set should be named `loginBackground`

### Step 4: Verify

1. Build and run the app
2. The background image should appear on:
   - Role selection screen
   - Login options screen
   - Email login/signup modal

## Current Implementation

The app is already configured to use `loginBackground` image:

- **Role Selection View**: Uses `loginBackground` with 40% dark overlay
- **Login Options View**: Uses `loginBackground` with 40% dark overlay
- **Email Login View**: Uses `loginBackground` with 50% dark overlay

## Fallback

If the image is not found, the app will fall back to:
- Dark purple background for role selection and login options
- System background for email login view

## Customization

To adjust the overlay darkness, edit these values in the views:

- `Color.black.opacity(0.4)` - 40% dark overlay (role selection, login options)
- `Color.black.opacity(0.5)` - 50% dark overlay (email login)

Change the opacity value (0.0 to 1.0) to make it lighter or darker.

## Troubleshooting

### Image not showing?

1. **Check image name**: Must be exactly `loginBackground` in Assets
2. **Check image set**: Make sure it's an Image Set, not a single image
3. **Rebuild**: Clean build folder (Cmd+Shift+K) and rebuild
4. **Check file location**: Image should be in Assets.xcassets

### Image looks stretched?

- Use `scaledToFill()` - fills entire screen (current)
- Use `scaledToFit()` - fits entire image (may show borders)
- Use `aspectRatio(contentMode: .fill)` - maintains aspect ratio

### Text not readable?

- Increase overlay opacity: `Color.black.opacity(0.6)` or higher
- Add blur effect: `.blur(radius: 2)`
- Add text shadows to improve readability

