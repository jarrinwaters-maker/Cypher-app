# App Transport Security Setup Instructions

## The Issue
Xcode projects with file system synchronization automatically include all files, which causes conflicts when we try to manually add Info.plist. 

## Solution: Add ATS Settings in Xcode UI

### Step 1: Open Xcode Project
1. Open `c705.xcodeproj` in Xcode

### Step 2: Add Info.plist File
1. In Xcode, right-click on the `c705` folder in Project Navigator
2. Select **"New File..."**
3. Choose **"Property List"** (under iOS → Resource)
4. Name it: `Info.plist`
5. Make sure it's added to the `c705` target

### Step 3: Add ATS Settings
1. Select the `Info.plist` file you just created
2. Right-click in the editor and select **"Add Row"**
3. Add the following key: `App Transport Security Settings` (type: Dictionary)
4. Inside that dictionary, add:
   - `Allow Arbitrary Loads` (type: Boolean) = `YES`
   - `Allow Arbitrary Loads in Web Content` (type: Boolean) = `YES` (optional)
   - `Allow Local Networking` (type: Boolean) = `YES`

### Step 4: Update Build Settings
1. Select the project in Project Navigator
2. Select the `c705` target
3. Go to **Build Settings** tab
4. Search for "Info.plist"
5. Set **"Generate Info.plist File"** to `NO`
6. Set **"Info.plist File"** to `c705/Info.plist`

### Step 5: Clean and Rebuild
1. Product → Clean Build Folder (Shift + Cmd + K)
2. Product → Build (Cmd + B)

## Alternative: Quick Fix (Temporary)

If you just want to test quickly, you can temporarily disable ATS entirely:

1. In Xcode, select project → Target → Build Settings
2. Search for "App Transport Security"
3. Add User-Defined Setting: `INFOPLIST_KEY_NSAppTransportSecurity_NSAllowsArbitraryLoads` = `YES`

However, this may not work with auto-generated Info.plist, so the manual method above is recommended.

## Verification

After setup, test the connection:
1. Run the app in iOS Simulator
2. Try logging in
3. Check Xcode console for connection logs

The ATS settings will allow HTTP connections to `localhost:3000` for development.

