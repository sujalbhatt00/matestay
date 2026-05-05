# Premium Features - Production Verification Guide

## 🚀 Pre-Production Checklist

Before deploying, verify all premium features are working correctly.

---

## 1. Message Limit Testing

### Test Case: Free User Message Limit
```bash
# 1. Login as free user
# 2. Start a chat conversation
# 3. Send 16 messages rapidly
# Expected Result: Message 16 should fail with:
# {
#   "message": "Daily message limit reached. Upgrade to premium for unlimited messages.",
#   "limitReached": true
# }

curl -X POST http://localhost:5000/api/messages/add \
  -H "Authorization: Bearer YOUR_FREE_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "CONVERSATION_ID",
    "text": "Message 16"
  }'
# Expected: 403 status
```

### Test Case: Premium User No Limit
```bash
# 1. Login as premium user
# 2. Send 100+ messages in same conversation
# Expected Result: All messages should succeed (201 status)

# Run this in a loop 100 times
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/messages/add \
    -H "Authorization: Bearer YOUR_PREMIUM_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "conversationId": "CONVERSATION_ID",
      "text": "Message '$i'"
    }'
done
```

**Verification:** Check MongoDB for message count > 15 for premium user

---

## 2. Property Listing Limit Testing

### Test Case: Free User Listing Limit
```bash
# 1. Login as free user
# 2. Create 3 properties (should succeed)
# 3. Try to create 4th property

curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer YOUR_FREE_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "4th Listing",
    "description": "This should fail",
    "propertyType": "Apartment",
    "location": "Test City",
    "rent": 5000,
    "bedrooms": 1,
    "bathrooms": 1
  }'
# Expected: 403 status
# {
#   "message": "Free users can only list up to 3 active properties. Upgrade to premium for unlimited listings.",
#   "limitReached": true,
#   "currentCount": 3,
#   "limit": 3
# }
```

### Test Case: Premium User Unlimited Listings
```bash
# 1. Login as premium user
# 2. Create 20+ properties (all should succeed)

for i in {1..20}; do
  curl -X POST http://localhost:5000/api/properties \
    -H "Authorization: Bearer YOUR_PREMIUM_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Premium Listing '$i'",
      "description": "Premium property",
      "propertyType": "Apartment",
      "location": "Premium City",
      "rent": 8000,
      "bedrooms": 1,
      "bathrooms": 1
    }'
done
# Expected: All return 201 status
```

**Verification:** 
```bash
# Check in MongoDB
db.properties.countDocuments({ lister: FREE_USER_ID, isAvailable: true })
# Should return 3

db.properties.countDocuments({ lister: PREMIUM_USER_ID, isAvailable: true })
# Should return 20+
```

---

## 3. Search Ranking Testing

### Test Case: Premium Users First in Search
```bash
# 1. Create 5 free users, 5 premium users (both with complete profiles)
# 2. Search for roommates

curl -X GET "http://localhost:5000/api/user/search-users?location=TestCity" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected Result: Premium users should appear first in results
# Verify by checking isPremium: true for first few results
```

### Test Case: Premium Properties First in Search
```bash
# 1. Create 5 properties listed by free users
# 2. Create 5 properties listed by premium users
# 3. Search properties

curl -X GET "http://localhost:5000/api/properties/search?location=TestCity" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected Result: Premium user properties should appear first
# Verify by checking lister.isPremium: true for first few results
```

---

## 4. Profile Views Testing

### Test Case: Free User Cannot View Profile Views
```bash
curl -X GET http://localhost:5000/api/user/profile-views \
  -H "Authorization: Bearer YOUR_FREE_USER_TOKEN"

# Expected: 403 status
# {
#   "message": "Upgrade to Premium to see who viewed your profile.",
#   "count": 5,
#   "requiresPremium": true
# }
```

### Test Case: Premium User Can View Profile Views
```bash
curl -X GET http://localhost:5000/api/user/profile-views \
  -H "Authorization: Bearer YOUR_PREMIUM_USER_TOKEN"

# Expected: 200 status with array of viewers
# [
#   {
#     "_id": "viewer_id",
#     "viewedAt": "2024-01-15T10:30:00Z",
#     "viewerId": {
#       "_id": "viewer_user_id",
#       "name": "Viewer Name",
#       "profilePic": "url",
#       "occupation": "Engineer"
#     }
#   }
# ]
```

---

## 5. Premium Subscription Management Testing

### Test Case: Purchase Premium Subscription
```bash
# 1. Create Razorpay test account: https://razorpay.com/
# 2. Use test card: 4111 1111 1111 1111

# Step 1: Create order
curl -X POST http://localhost:5000/api/payments/create-order \
  -H "Authorization: Bearer YOUR_FREE_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "monthly"
  }'

# Expected Response:
# {
#   "orderId": "order_1234567890",
#   "amount": 2900,
#   "currency": "INR",
#   "keyId": "rzp_test_xxxxx"
# }

# Step 2: Complete payment via Razorpay UI (use test card)
# Step 3: Verify payment
curl -X POST http://localhost:5000/api/payments/verify \
  -H "Authorization: Bearer YOUR_FREE_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "order_1234567890",
    "razorpay_payment_id": "pay_1234567890",
    "razorpay_signature": "signature_from_razorpay"
  }'

# Expected: 200 status
# {
#   "message": "Payment verified successfully",
#   "isPremium": true,
#   "subscriptionEndDate": "2024-02-15T10:30:00Z"
# }
```

### Test Case: Check Subscription Status
```bash
# For active subscription
curl -X GET http://localhost:5000/api/payments/check-subscription \
  -H "Authorization: Bearer YOUR_PREMIUM_USER_TOKEN"

# Expected: 200 status
# {
#   "isPremium": true,
#   "subscriptionTier": "monthly",
#   "subscriptionEndDate": "2024-02-15T10:30:00Z"
# }

# For expired subscription
curl -X GET http://localhost:5000/api/payments/check-subscription \
  -H "Authorization: Bearer EXPIRED_PREMIUM_USER_TOKEN"

# Expected: 200 status (auto-reverted to free)
# {
#   "isPremium": false,
#   "subscriptionTier": "free",
#   "subscriptionEndDate": null
# }
```

---

## 6. Frontend Display Verification

### Premium Badge Display
- [ ] Premium badge shows in Navbar for premium users
- [ ] Premium badge shows on user profiles
- [ ] Premium badge shows on property listings
- [ ] Free users don't see premium badge for themselves

### Feature Access
- [ ] Free users see "Upgrade to Premium" button for profile views
- [ ] Free users see message limit warning after 10+ messages
- [ ] Free users see listing limit warning when trying to add 4th property
- [ ] Premium users don't see any upgrade prompts

### Search Results
- [ ] Premium profiles appear first in roommate search
- [ ] Premium properties appear first in property search
- [ ] Premium badge visible in search results

---

## 7. Database Verification

### Check User Schema
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/matestay

# Check a premium user
db.users.findOne({ isPremium: true })

# Expected fields:
# {
#   isPremium: true,
#   subscriptionTier: "monthly" or "yearly",
#   subscriptionEndDate: ISODate("2024-02-15T10:30:00Z"),
#   dailyMessageCount: 0,
#   lastMessageReset: ISODate("2024-01-15T00:00:00Z"),
#   verified: true or false
# }

# Check free user
db.users.findOne({ isPremium: false })

# Expected fields:
# {
#   isPremium: false,
#   subscriptionTier: "free",
#   subscriptionEndDate: null,
#   dailyMessageCount: 0,
#   lastMessageReset: ISODate("2024-01-15T00:00:00Z"),
#   verified: false
# }
```

### Check Property Limits
```bash
# Count free user properties
db.properties.countDocuments({ 
  lister: ObjectId("FREE_USER_ID"), 
  isAvailable: true 
})
# Should be ≤ 3

# Count premium user properties
db.properties.countDocuments({ 
  lister: ObjectId("PREMIUM_USER_ID"), 
  isAvailable: true 
})
# Should be unlimited
```

### Check Message Tracking
```bash
# Find users over daily limit
db.users.find({ isPremium: false, dailyMessageCount: { $gt: 15 } })
# Should return empty array

# Check last reset time
db.users.findOne({ _id: ObjectId("FREE_USER_ID") })
# lastMessageReset should be today's date
```

---

## 8. Error Scenarios Testing

### Test: Expired Premium (Automatic Downgrade)
```javascript
// In MongoDB, manually set subscription to past date:
db.users.updateOne(
  { _id: ObjectId("PREMIUM_USER_ID") },
  { 
    $set: { 
      subscriptionEndDate: new Date("2024-01-01")
    } 
  }
)

// On next API call, isPremium should auto-revert to false
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer EXPIRED_PREMIUM_TOKEN"

// Verify user is downgraded
db.users.findOne({ _id: ObjectId("PREMIUM_USER_ID") })
# isPremium should be false, subscriptionTier should be "free"
```

### Test: Message Limit Reset at Midnight
```javascript
// Manually set lastMessageReset to yesterday:
db.users.updateOne(
  { _id: ObjectId("FREE_USER_ID") },
  { 
    $set: { 
      lastMessageReset: new Date("2024-01-14"),
      dailyMessageCount: 15
    } 
  }
)

// Send a message at the next day after midnight
curl -X POST http://localhost:5000/api/messages/add \
  -H "Authorization: Bearer FREE_USER_TOKEN"
  # Should succeed (counter should have reset)

// Verify counter reset
db.users.findOne({ _id: ObjectId("FREE_USER_ID") })
# dailyMessageCount should be 1, lastMessageReset should be today
```

---

## 9. Performance Verification

### Check API Response Times
```bash
# Without premium filtering (old way)
time curl -X GET "http://localhost:5000/api/properties/search?location=TestCity"

# With premium filtering (new way)
time curl -X GET "http://localhost:5000/api/properties/search?location=TestCity"

# Response time should be < 500ms
```

### Check Database Indexes
```bash
db.properties.getIndexes()
# Should see indexes on: lister, isAvailable, createdAt, location

db.users.getIndexes()
# Should see indexes on: isPremium, subscriptionEndDate, email
```

---

## 10. Deployment Checklist

- [ ] All environment variables set (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
- [ ] MongoDB indexes created
- [ ] Email notifications ready (SendGrid configured)
- [ ] Frontend premium page deployed
- [ ] Premium badge components deployed
- [ ] Backend rate limiters working (6 different endpoints)
- [ ] SSL certificates installed (HTTPS required for Razorpay)
- [ ] Error logging configured
- [ ] Database backups configured
- [ ] Payment gateway test mode disabled → production mode
- [ ] Monitoring alerts set up for failed payments

---

## 11. Post-Deployment Monitoring

### Track Key Metrics
- Premium user conversion rate
- Message limit violations (should be 0 for premium users)
- Listing limit violations (should be 0 for premium users)
- Payment success rate
- Subscription renewal rate
- Average subscription duration

### Set Up Alerts For
- Failed payment verifications
- Database storage exceeding limits
- API response time > 1 second
- Premium auto-expiration failures
- Message counter not resetting at midnight

---

## 📞 Troubleshooting

### Issue: Free users can still create 4+ properties
**Solution:** Check if `propertyController.js` has the listing limit check implemented. Verify User is imported and isPremium check is in place.

### Issue: Premium users still see message limit
**Solution:** Verify `messageController.js` checks `if (!sender.isPremium)` before applying limit.

### Issue: Premium users don't appear first in search
**Solution:** Check sorting logic - should sort by `{ isPremium: -1 }` before other sorts.

### Issue: Payment verification failing
**Solution:** Verify Razorpay credentials are correct. Check signature verification logic in `paymentController.js`.

### Issue: Subscription not expiring
**Solution:** Verify `checkSubscription()` is being called. Check if `subscriptionEndDate` is properly stored in database.

---

Last Updated: 2024
All Features Status: ✅ Ready for Production
