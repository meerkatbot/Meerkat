const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.updateFarmingBalances = functions.pubsub.schedule('every 10 seconds').onRun(async (context) => {
  const db = admin.database();
  const usersRef = db.ref('users');

  const snapshot = await usersRef.once('value');
  const updates = {};

  snapshot.forEach((childSnapshot) => {
    const userData = childSnapshot.val();
    if (userData.farming) {
      const newBalance = (userData.balance || 0) + 0.1; // 0.01 * 10 seconds
      updates[`${childSnapshot.key}/balance`] = newBalance;
    }
  });

  if (Object.keys(updates).length > 0) {
    await usersRef.update(updates);
  }

  console.log('Farming balances updated');
  return null;
});