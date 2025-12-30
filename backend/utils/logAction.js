const db = require("../config/db");

module.exports = async function logAction(adminUserId, action, target) {
  try {
    await db.promise().query(
      `
      INSERT INTO systemlogs
      (admin_user_id, action, target, created_at)
      VALUES (?, ?, ?, NOW())
      `,
      [adminUserId, action, target]
    );
  } catch (err) {
    console.error("SYSTEM LOG ERROR:", err);
  }
};
