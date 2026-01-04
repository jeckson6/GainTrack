const db = require("../config/db");

module.exports = async function logAction(userId, action, target) {
  if (!userId) return;
  try {
    await db.promise().query(
      `
      INSERT INTO systemlogs
      (user_id, action, target, created_at)
      VALUES (?, ?, ?, NOW())
      `,
      [userId, action, target]
    );
  } catch (err) {
    console.error("SYSTEM LOG ERROR:", err);
  }
};
