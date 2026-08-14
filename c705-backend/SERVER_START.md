# Starting the Server

## Quick Start

1. **Build the project first:**
   ```bash
   cd c705-backend
   npm run build
   ```

2. **Start the development server:**
   ```bash
   npm run start:dev
   ```

3. **Wait for the success message:**
   ```
   Nest application successfully started
   Application is running on: http://localhost:3000
   ```

## Troubleshooting

### Error: Cannot find module 'dist/main'

**Solution:** Run `npm run build` first, then start the server:
```bash
npm run build
npm run start:dev
```

The build script automatically fixes the dist structure.

### Server won't start

1. **Kill any running processes:**
   ```bash
   pkill -f "nest start"
   ```

2. **Clean and rebuild:**
   ```bash
   rm -rf dist
   npm run build
   npm run start:dev
   ```

### Port already in use

If port 3000 is already in use:
1. Check what's using it: `lsof -i :3000`
2. Kill the process or change the port in `.env` file

## Testing in Postman

Once the server is running:
1. Open Postman
2. Import `postman_collection.json`
3. Start with **Signup** or **Login**
4. Token will be saved automatically

## Production Build

For production:
```bash
npm run build
npm run start:prod
```

