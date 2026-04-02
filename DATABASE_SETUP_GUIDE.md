# 🗄️ Render Database Setup Guide

## Current Error

```
ValueError: No support for ''. We support: ... postgres, postgresql ...
```

**Cause**: DATABASE_URL environment variable is empty because the PostgreSQL database hasn't been created or connected.

---

## ✅ Quick Fix - Two Options

### Option A: Use PostgreSQL (Recommended for Production)

#### Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → Select **"PostgreSQL"**
3. **Configure Database**:
   - Name: `tdms-db` (must match render.yaml)
   - Database: `tdms` (or any name)
   - User: `tdms` (or any username)
   - Region: Same as your backend service
   - Plan: **Free** (0.1 GB storage)
4. **Click "Create Database"**
5. **Wait 2-3 minutes** for database to be created

#### Step 2: Connect Database to Backend Service

1. **Go to your backend service**: tdms-backend
2. **Click "Environment"** tab
3. **Add Environment Variable**:
   - Click "Add Environment Variable"
   - **Key**: `DATABASE_URL`
   - **Value**: Click "Add from Database" 
   - Select: `tdms-db`
   - Property: `Internal Database URL` or `Connection String`
4. **Save Changes**

#### Step 3: Redeploy Backend

The service should auto-deploy. If not:
1. Go to **Manual Deploy** → **Deploy latest commit**
2. Wait for deployment to complete
3. Check logs for success

**Expected**: Deployment should succeed and migrations will run automatically.

---

### Option B: Use SQLite (Quick Fix for Testing)

**I've already updated the code to handle this!**

If DATABASE_URL is empty, it will automatically fall back to SQLite.

#### Pros:
- ✅ Works immediately, no database setup needed
- ✅ Good for testing/development
- ✅ Free tier friendly

#### Cons:
- ❌ Not recommended for production
- ❌ Data resets when service restarts on Render free tier
- ❌ Not scalable
- ❌ Limited concurrent access

**To use SQLite**: Simply redeploy without setting DATABASE_URL. The app will use SQLite automatically.

---

## 🚀 Deployment Steps After Database Setup

### If Using PostgreSQL (Option A):

1. **Push code changes**:
   ```bash
   git add .
   git commit -m "Fix database configuration and CORS"
   git push origin main
   ```

2. **Wait for auto-deploy** (3-5 minutes)

3. **Verify deployment**:
   - Check Render logs for "Application startup complete"
   - Visit: https://tdms-backend.onrender.com/admin/

### If Using SQLite (Option B):

1. **Push code changes** (same as above)

2. **Remove DATABASE_URL** from environment variables (if set):
   - Go to Render Dashboard → tdms-backend → Environment
   - Find `DATABASE_URL` variable
   - Click "Delete" (if it exists and is empty)
   - Save changes

3. **Redeploy**: Manual Deploy → Deploy latest commit

---

## 🧪 Verify Database is Working

### Test 1: Check Admin Panel
```bash
curl -I https://tdms-backend.onrender.com/admin/
```
✅ Should return: `200 OK`

### Test 2: Create a Test User via API
```bash
curl -X POST https://tdms-backend.onrender.com/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001",
    "email": "test001@example.com",
    "password": "TestPass123!",
    "role": "DONOR"
  }'
```
✅ Should return user data with ID

### Test 3: Login with Test User
```bash
curl -X POST https://tdms-backend.onrender.com/api/users/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser001",
    "password": "TestPass123!"
  }'
```
✅ Should return access and refresh tokens

---

## 📋 Environment Variables Checklist

After database setup, verify these are set in Render:

### Required:
- [x] `DEBUG` = `False`
- [x] `SECRET_KEY` = (auto-generated)
- [x] `ALLOWED_HOSTS` = `.onrender.com`
- [x] `CORS_ALLOWED_ORIGINS` = `https://tdms-one.vercel.app`

### Database (Choose one):
- **PostgreSQL**: 
  - [x] `DATABASE_URL` = (from tdms-db database)
- **SQLite**: 
  - [ ] No DATABASE_URL needed (will use SQLite automatically)

### Optional:
- [ ] `RAZORPAY_KEY_ID` = (your key)
- [ ] `RAZORPAY_KEY_SECRET` = (your secret)

---

## 🔍 Troubleshooting Database Issues

### Error: "No support for ''"
**Cause**: DATABASE_URL is set but empty
**Fix**: 
- Option 1: Connect to PostgreSQL database properly
- Option 2: Delete the empty DATABASE_URL variable to use SQLite

### Error: "could not connect to server"
**Cause**: PostgreSQL database not accessible
**Fix**:
- Check database is in "Available" status
- Verify database is in same region as backend
- Use "Internal Database URL" not external URL

### Error: "relation 'users_user' does not exist"
**Cause**: Migrations haven't run
**Fix**:
- Check build.sh runs migrations: `python manage.py migrate`
- Manually run migrations via Render shell (if available)
- Redeploy the service

### Error: "password authentication failed"
**Cause**: DATABASE_URL credentials incorrect
**Fix**:
- Re-add DATABASE_URL from Render database connection info
- Verify database user and password match

---

## 📊 Render Database Dashboard

After creating database, you can:
- **View Connection Info**: Click on database → Connection Details
- **Monitor Usage**: See storage and connection stats
- **Access Logs**: View database logs
- **Download Backup**: Export database data (paid plans)

---

## 🎯 Recommended Setup

**For Testing/Development**:
- ✅ Use SQLite (already configured as fallback)
- ✅ Fast setup, no additional configuration

**For Production/Real Users**:
- ✅ Use PostgreSQL (create tdms-db on Render)
- ✅ Persistent data storage
- ✅ Better performance and reliability

---

## 📞 Quick Help

**Database creation fails?**
- Check your Render account has database quota available
- Free tier: 1 PostgreSQL database limit
- Verify billing/payment method is set

**DATABASE_URL not showing?**
- Wait 2-3 minutes after database creation
- Refresh Render dashboard
- Check database status is "Available"

**Still getting errors?**
- Share the full error log from Render deployment
- Check if build.sh commands are running
- Verify python version matches (3.12.0)

---

## 🔗 Useful Links

- Render Databases: https://dashboard.render.com/databases
- Render Documentation: https://render.com/docs/databases
- Django Database Config: https://docs.djangoproject.com/en/6.0/ref/databases/

---

**Status**: Code updated to handle empty DATABASE_URL. 
**Next**: Either create PostgreSQL database OR redeploy to use SQLite automatically.
