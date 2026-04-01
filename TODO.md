# MongoDB Atlas Authentication Fix Steps

## 1. Check/Whitelist Your IP in Atlas
```
curl ipinfo.io/ip  # Get your public IP
```
- Go to MongoDB Atlas > Network Access
- Add your IP (or 0.0.0.0/0 for testing - remove later)
- Wait 1-2 min for propagation

## 2. Verify/Create Database User
- Atlas > Database Access
- Create/edit user with username/password
- Permissions: `readWriteAnyDatabase` or specific DB
- Note: Password cannot contain `@`, use `%40` if needed

## 3. Update backend/.env MONGO_URI
```
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/babycare?retryWrites=true&w=majority
```
- Replace USERNAME, PASSWORD, cluster0.xxxxx (your cluster)
- Database name: `babycare` (or your choice)
- URL-encode special chars in password (e.g. @ -> %40, # -> %23)

## 4. Test Connection
```
cd backend
node server.js
```
Windows CMD: `cd backend && node server.js` won't work - run separately:
```
cd backend
node server.js
```

Look for: `Connected to MongoDB`

## 5. Validate URI (optional)
Install mongosh: `npm install -g mongosh`
```
mongosh "your MONGO_URI here"
```

## 6. Common Issues
- Password has special chars? URL-encode
- Still fails? Check Atlas project is correct cluster
- Local dev? Ensure no VPN blocking

## Test Signup
```
cd backend
node test_simple.js  # Tests register/login - expect Mongo error until fixed
```
Windows: run `cd backend` then `node test_simple.js`

Expected: ✅ Registered! ✅ Logged in!

## Frontend Test
Open signup page → fill form → submit
API: POST http://localhost:5000/api/auth/register

If "Server error" → Mongo still broken
If "User already exists" → success (user created)

**Delete TODO.md when signup works.**


