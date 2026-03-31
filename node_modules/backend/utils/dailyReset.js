
const Feeding = require('../models/feeding');
const DiaperLog = require('../models/diaperlog');
const SleepLog = require('../models/sleeplog');

// Archive all logs that are not for today's date (YYYY-MM-DD)
async function runReset() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Fetch old docs as plain objects
    const oldFeedings = await Feeding.find({ date: { $ne: today } }).lean();
    const oldDiapers = await DiaperLog.find({ date: { $ne: today } }).lean();
    const oldSleeps = await SleepLog.find({ date: { $ne: today } }).lean();

    let feedInserted = 0, diaperInserted = 0, sleepInserted = 0;
    // Insert into archive collections if any
    if (oldFeedings.length > 0) {
      // target collection name: feeding_archives
      const res = await Feeding.collection.insertMany(oldFeedings, { ordered: false }).catch(() => null);
      feedInserted = (res && res.insertedCount) || 0;
    }
    if (oldDiapers.length > 0) {
      const res = await DiaperLog.collection.insertMany(oldDiapers, { ordered: false }).catch(() => null);
      diaperInserted = (res && res.insertedCount) || 0;
    }
    if (oldSleeps.length > 0) {
      const res = await SleepLog.collection.insertMany(oldSleeps, { ordered: false }).catch(() => null);
      sleepInserted = (res && res.insertedCount) || 0;
    }

    // Delete originals after successful (or attempted) archive insert
    const feedDel = await Feeding.deleteMany({ date: { $ne: today } });
    const diaperDel = await DiaperLog.deleteMany({ date: { $ne: today } });
    const sleepDel = await SleepLog.deleteMany({ date: { $ne: today } });

    console.log(`[dailyReset] Completed at ${new Date().toISOString()} — archived then removed`, {
      archived: { feed: feedInserted, diaper: diaperInserted, sleep: sleepInserted },
      deleted: { feed: feedDel.deletedCount, diaper: diaperDel.deletedCount, sleep: sleepDel.deletedCount }
    });
  } catch (error) {
    console.error('[dailyReset] Error during archive reset:', error);
  }
}

function scheduleDailyReset() {
  // Run immediately once to ensure state is clean on startup
  runReset().catch((e) => console.error('[dailyReset] startup run error', e));

  // Schedule next run at exact local 00:00 (midnight) and reschedule each day
  function scheduleNextMidnight() {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    next.setHours(0, 0, 0, 0, 0);
    const msUntilNextMidnight = next - now;

    setTimeout(async () => {
      await runReset().catch((e) => console.error('[dailyReset] midnight run error', e));
      // After running at midnight, schedule the following midnight (recompute to avoid drift/ DST issues)
      scheduleNextMidnight();
    }, msUntilNextMidnight);

    console.log('[dailyReset] Scheduled next run in', msUntilNextMidnight, 'ms (at local 00:00)', next.toISOString());
  }

  scheduleNextMidnight();
}

module.exports = scheduleDailyReset;
