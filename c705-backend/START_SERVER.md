# How to Start the Server

## The Issue

Watch mode compiles files to `dist/c705-backend/src/main.js` but the server expects `dist/main.js`.

## Solution: Use Build + Start (Recommended)

**Step 1: Build the project**
```bash
cd c705-backend
npm run build
```

This automatically fixes the dist structure.

**Step 2: Start the server**
```bash
npm run start:dev
```

**Note:** If watch mode recompiles and you get the error again, just run `npm run build` again in another terminal, or stop and restart.

## Alternative: Manual Fix

If you get the error, run this in another terminal:

```bash
cd c705-backend
npm run fix:dist
```

The server should automatically restart and pick up the fix.

## Quick Test

Once server shows "successfully started":
```bash
curl http://localhost:3000
# Should return: Hello World!
```

## For Postman Testing

1. Make sure server is running (see above)
2. Import `postman_collection.json`
3. Test endpoints

