const db = require("../config/db");

/* ======================
   CREATE
====================== */
exports.createRecord = async (req, res) => {
  try {
    const {
      userId,
      height,
      weight,
      bmi,
      bodyFat,
      recordedDate
    } = req.body;

    if (!userId || !weight || !bmi || !recordedDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get FIRST NON-NULL height (baseline)
    const [rows] = await db.promise().query(
      `
      SELECT height_cm
      FROM health_record
      WHERE user_id = ?
        AND height_cm IS NOT NULL
      ORDER BY recorded_date ASC
      LIMIT 1
      `,
      [userId]
    );

    const baselineHeight =
      rows.length > 0 ? Number(rows[0].height_cm) : null;

    let finalHeight;

    if (!baselineHeight) {
      if (!height) {
        return res.status(400).json({
          code: "HEIGHT_REQUIRED",
          message:
            "Height is required because no baseline height exists yet"
        });
      }
      finalHeight = Number(height);
    } else {
      finalHeight = baselineHeight;
    }

    await db.promise().query(
      `
      INSERT INTO health_record
        (user_id, height_cm, weight_kg, body_fat_percentage, bmi, recorded_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        userId,
        finalHeight,
        weight,
        bodyFat || null,
        bmi,
        recordedDate
      ]
    );

    res.json({ message: "Health record added successfully" });

  } catch (err) {
    console.error("CREATE HEALTH RECORD ERROR:", err);
    res.status(500).json({ message: "Failed to add health record" });
  }
};

/* ======================
   READ
====================== */
exports.getRecords = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  db.query(
    `
    SELECT *
    FROM health_record
    WHERE user_id = ?
    ORDER BY recorded_date DESC
    `,
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
    }
  );
};

/* ======================
   UPDATE
====================== */
exports.updateRecord = (req, res) => {
  const { recordId } = req.params;
  const { weight, bodyFat, bmi } = req.body;

  db.query(
    `
    UPDATE health_record
    SET weight_kg = ?, body_fat_percentage = ?, bmi = ?
    WHERE record_id = ?
    `,
    [weight, bodyFat, bmi, recordId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Update failed" });
      }
      res.json({ message: "Record updated" });
    }
  );
};

/* ======================
   DELETE
====================== */
exports.deleteRecord = (req, res) => {
  const { recordId } = req.params;

  db.query(
    "DELETE FROM health_record WHERE record_id = ?",
    [recordId],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Delete failed" });
      }
      res.json({ message: "Record deleted" });
    }
  );
};
