const express = require('express');
const pool = require('../db');
const { requireAuth, hasRole } = require('../session');

const router = express.Router();

router.use(requireAuth);

/*
 * Approved and active Riders available for allocation.
 * Used by Agent/Admin allocation screens.
 */
router.get('/', hasRole('agent', 'admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         phone,
         number_plate,
         service_area,
         location,
         is_available,
         current_lat,
         current_lng,
         rating,
         last_active_at
       FROM riders
       WHERE verification_status = 'approved'
         AND account_status = 'active'
         AND is_available = TRUE
       ORDER BY name ASC`
    );

    res.json({
      success: true,
      riders: result.rows
    });
  } catch (error) {
    console.error('riders list', error);

    res.status(500).json({
      success: false,
      error: 'Unable to load riders'
    });
  }
});

module.exports = router;
