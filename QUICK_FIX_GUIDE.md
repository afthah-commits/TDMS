# 🎯 Quick Fix Checklist

## ✅ Immediate Actions

### 1. Push Updated Code
```bash
git add .
git commit -m "Fix CORS configuration"
git push
```

### 2. Add Environment Variable in Render
1. Go to: https://dashboard.render.com
2. Select: `tdms-backend`
3. Go to: Environment tab
4. Add Variable:
   - Name: `CORS_ALLOWED_ORIGINS`
   - Value: `https://tdms-one.vercel.app`
5. Click: Save Changes

### 3. Wait for Deployment
- Render will auto-deploy (3-5 minutes)
- Watch the deployment in Logs tab

### 4. Wake Up the Service
Visit: https://tdms-backend.onrender.com/admin/
(Wait 30-60 seconds for it to wake up)

### 5. Test Registration
1. Go to: https://tdms-one.vercel.app
2. Click: Register
3. Fill form and submit

---

## 🔍 Quick Verification Tests

### Test 1: Is backend alive?
```bash
curl -I https://tdms-backend.onrender.com/admin/
```
✅ Should return: `200 OK`
❌ Returns: `503` = Still sleeping or error

### Test 2: CORS working?
```bash
curl -X OPTIONS https://tdms-backend.onrender.com/api/users/register/ \
  -H "Origin: https://tdms-one.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep -i "access-control"
```
✅ Should see: `access-control-allow-origin: https://tdms-one.vercel.app`

### Test 3: Can register?
```bash
curl -X POST https://tdms-backend.onrender.com/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test99","email":"test99@test.com","password":"Pass123456!","role":"DONOR"}'
```
✅ Returns user data with id
❌ Returns error with details

---

## 🚨 Common Errors & Quick Fixes

| Error | Meaning | Fix |
|-------|---------|-----|
| 503 Service Unavailable | Backend sleeping/error | Wait 60s or check Render logs |
| 502 Bad Gateway | Backend crashed | Check Render logs, redeploy |
| CORS Error in browser | Origin not allowed | Verify CORS_ALLOWED_ORIGINS env var |
| "Registration failed" | Backend validation error | Check browser console for details |
| Database error | DB not connected | Check DATABASE_URL in Render |

---

## 📍 Important URLs

- **Render Dashboard**: https://dashboard.render.com
- **Backend**: https://tdms-backend.onrender.com
- **Frontend**: https://tdms-one.vercel.app
- **Admin Panel**: https://tdms-backend.onrender.com/admin/
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## 📝 Environment Variables to Check in Render

- [x] `DEBUG` = False
- [x] `SECRET_KEY` = (auto-generated)
- [x] `ALLOWED_HOSTS` = .onrender.com
- [x] `DATABASE_URL` = (from database)
- [x] `CORS_ALLOWED_ORIGINS` = https://tdms-one.vercel.app ← **ADD THIS**
- [ ] `RAZORPAY_KEY_ID` = (your key)
- [ ] `RAZORPAY_KEY_SECRET` = (your secret)

---

## 🎬 Final Test

After completing all steps:

1. Open: https://tdms-one.vercel.app
2. Open Browser DevTools (F12)
3. Go to: Console tab
4. Click: Register
5. Fill in form with:
   - Username: mytestuser
   - Email: mytest@example.com
   - Password: TestPass123!
   - Role: Donor
6. Submit

**Success Indicators**:
- ✅ Redirected to login page
- ✅ No red errors in console
- ✅ Network tab shows 200/201 response

**Failure Indicators**:
- ❌ "Registration failed" message
- ❌ CORS error in console
- ❌ Network tab shows 500/502/503

---

**Need Help?** Share:
1. Screenshot of browser console errors
2. Render deployment logs
3. Response from test curl commands
