# 🧪 Test Registration Locally (Optional)

If you want to test the registration logic works correctly before deploying to Render, you can test it locally.

## Setup Local Testing Environment

### 1. Install Dependencies
```bash
cd /app/backend
pip install -r requirements.txt
```

### 2. Create Local Database
```bash
python manage.py migrate
```

### 3. Create a Test Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

---

## Test Registration Endpoint Locally

### Test 1: Valid Registration
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "role": "DONOR"
  }'
```

**Expected Response**:
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "DONOR"
}
```

### Test 2: Duplicate Username
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "another@example.com",
    "password": "TestPass123!",
    "role": "DONOR"
  }'
```

**Expected Response**:
```json
{
  "username": ["A user with that username already exists."]
}
```

### Test 3: Weak Password
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "123",
    "role": "DONOR"
  }'
```

**Expected Response**:
```json
{
  "password": [
    "This password is too short. It must contain at least 8 characters.",
    "This password is too common.",
    "This password is entirely numeric."
  ]
}
```

### Test 4: Invalid Email
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser3",
    "email": "notanemail",
    "password": "TestPass123!",
    "role": "DONOR"
  }'
```

**Expected Response**:
```json
{
  "email": ["Enter a valid email address."]
}
```

---

## Test Login After Registration

### Get JWT Token
```bash
curl -X POST http://localhost:8000/api/users/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

**Expected Response**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Test Authenticated Endpoint
```bash
# Replace TOKEN with the access token from above
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response**:
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "DONOR"
}
```

---

## Verify Database

### Check Users in Database
```bash
python manage.py shell
```

Then in the Python shell:
```python
from users.models import User

# See all users
for user in User.objects.all():
    print(f"{user.id}: {user.username} ({user.email}) - {user.role}")

# Count users
print(f"Total users: {User.objects.count()}")

# Check specific user
user = User.objects.get(username='testuser')
print(f"User: {user.username}")
print(f"Email: {user.email}")
print(f"Role: {user.role}")
print(f"Password hashed: {user.password[:20]}...")
```

Type `exit()` to leave the shell.

---

## Common Local Testing Issues

### Issue: Port Already in Use
```bash
# Kill process on port 8000
sudo lsof -ti:8000 | xargs kill -9
```

### Issue: Migration Errors
```bash
# Reset database (WARNING: Deletes all data)
rm db.sqlite3
python manage.py migrate
```

### Issue: Module Not Found
```bash
# Make sure you're in the right directory
cd /app/backend

# Reinstall requirements
pip install -r requirements.txt
```

---

## Verify Code Logic

### Check User Model
```bash
cat /app/backend/users/models.py
```

Should show:
- Custom User model extending AbstractUser
- Role choices: ADMIN, VOLUNTEER, DONOR
- Default role: DONOR

### Check Serializer
```bash
cat /app/backend/users/serializers.py
```

Should show:
- RegisterSerializer with password validation
- create() method using create_user()
- Fields: username, password, email, role

### Check View
```bash
cat /app/backend/users/views.py
```

Should show:
- RegisterView using CreateAPIView
- AllowAny permission
- RegisterSerializer

---

## Summary

If all local tests pass:
- ✅ Registration logic is correct
- ✅ Serializer validation works
- ✅ User model is properly configured
- ✅ JWT authentication works

The issue is definitely in the **deployment configuration** (Render backend wake/CORS), not in the code logic.

---

**Note**: Local testing is optional. The main fix is updating the CORS configuration and deploying to Render.
