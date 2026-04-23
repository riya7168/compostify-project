# Gmail Setup for Compostify

To enable email notifications (OTP, Password Reset), follow these steps:

## Step 1: Create a Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Enable **2-Step Verification** (if not already enabled)
4. Scroll down and find **App passwords**
5. Select **Mail** and **Windows Computer** (or your device)
6. Google will generate a **16-character app password**
7. Copy this password (you'll need it in Step 3)

## Step 2: Set Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `xxxx xxxx xxxx xxxx` with the 16-character app password from Step 1

## Step 3: Restart Your Server

Stop your backend server and restart it:

```bash
npm start
```

## Step 4: Test It

1. Go to the login page
2. Click "Forgot password?"
3. Enter your email
4. Check your email for the reset code
5. You should receive an email within 30 seconds

## Troubleshooting

**Email not received?**
- Check spam/trash folder
- Verify GMAIL_EMAIL and GMAIL_APP_PASSWORD in `.env` are correct
- Check server console for error messages
- Make sure 2-Step Verification is enabled on your Gmail account

**"Less secure app access" error?**
- This won't appear if you use App Passwords (Step 1)
- If you see this, delete `.env` and redo Step 1-2 correctly

**Still not working?**
- Verify `.env` is in the `backend` folder (not root)
- Restart the server after adding `.env`
- Check server console logs for detailed error messages

---

**Note:** App Passwords are safer than using your regular Gmail password. Never commit `.env` to version control!
