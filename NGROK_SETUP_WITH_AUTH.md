# Ngrok Setup with Authentication (Required)

Ngrok now requires a free account. Here's how to set it up:

## Step 1: Sign Up for Free Ngrok Account

1. Go to: https://dashboard.ngrok.com/signup
2. Sign up with your email (it's free)
3. Verify your email if needed

## Step 2: Get Your Authtoken

1. After signing up, go to: https://dashboard.ngrok.com/get-started/your-authtoken
2. You'll see your authtoken (looks like: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz_5A6B7C8D9E0F1G2H3I4J5K`)
3. Copy the entire authtoken

## Step 3: Install Authtoken

Run this command in your terminal (replace `YOUR_AUTHTOKEN` with the actual token):

```bash
ngrok config add-authtoken YOUR_AUTHTOKEN
```

Example:
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz_5A6B7C8D9E0F1G2H3I4J5K
```

You should see: `Authtoken saved to configuration file: /Users/ace/.ngrok2/ngrok.yml`

## Step 4: Start Ngrok

Now you can run:
```bash
ngrok http 3000
```

You should see output like:
```
Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

## Step 5: Copy the HTTPS URL

Copy the `Forwarding` URL (the `https://` one):
```
https://abc123-def456.ngrok.app
```

## Step 6: Use in Your App

Follow the steps in `QUICK_NGROK_SETUP.md` starting from Step 4.

## Troubleshooting

**"authtoken not found" error?**
- Make sure you copied the entire token (it's long!)
- Check for extra spaces before/after the token
- Try running the command again

**"Invalid authtoken" error?**
- Make sure you're using the token from the dashboard
- Check that you signed up and verified your email
- Try getting a new token from the dashboard

**Still having issues?**
- Check ngrok status: `ngrok config check`
- View your config: `cat ~/.ngrok2/ngrok.yml`
- Get help: https://ngrok.com/docs/errors/err_ngrok_4018

## Alternative: Use LocalTunnel (No Account Required)

If you don't want to sign up for ngrok, you can use LocalTunnel instead:

```bash
# Install LocalTunnel
npm install -g localtunnel

# Start tunnel
lt --port 3000
```

This will give you a URL like: `https://random-subdomain.loca.lt`

Then use this URL in your app instead of the ngrok URL.
