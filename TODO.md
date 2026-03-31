# Reminder Timing Fix - Perfect 15min Lead Time

## Plan Breakdown:
1. [x] Update my/backend/models/feeding.js: Set reminderMinutes default=15\n2. [x] Update my/backend/models/diaperlog.js: Set reminderMinutes default=15 (currently 5)
3. [x] Update my/backend/controllers/feedingController.js: Remove reminderMinutes override (use model default)\n4. [x] Update my/backend/utils/reminderScheduler.js: \n   - First reminder now exact: now >= reminderTime && !reminderSent (no more ±5min window)\n   - Defaults standardized to 15min\n   - Improved precise logging\n
   - Change first reminder to exact time: now >= reminderTime && !reminderSent
   - Consistent defaults & logic for diaper/feedings
   - Better logging
5. [ ] Restart server and test with test_reminder_flow.js (set reminderMinutes=2 for quick test)
6. [ ] Verify production: Create feeding 17min from now, confirm reminder at exactly -15min

**Current:** Starting step 1...

