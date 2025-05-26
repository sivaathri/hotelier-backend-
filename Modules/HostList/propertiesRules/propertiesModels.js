const db = require('../../../config/db');

class PropertyRules {
  // Get all property rules
  static async getAllRules() {
    const [rows] = await db.query('SELECT * FROM property_rules');
    return rows;
  }

  // Get rules by property ID
  static async getRulesById(id) {
    const [rows] = await db.query('SELECT * FROM property_rules WHERE id = ?', [id]);
    if (rows.length === 0) throw new Error('Property rules not found');
    return rows[0];
  }

  // Get rules by user ID
  static async getRulesByUserId(user_id) {
    const [rows] = await db.query('SELECT * FROM property_rules WHERE user_id = ?', [user_id]);
    return rows;
  }

  // Create new rules
  static async createRules(user_id, data) {
    const fields = [
      "property_id", "user_id", "check_in_time", "check_out_time", "min_guest_age", "proof_type",
      "unmarried_couples_allowed", "male_only_groups_allowed", "scanty_baggage_allowed",
      "smoking_allowed", "alcohol_allowed", "non_veg_allowed", "outside_food_allowed",
      "food_delivery_service", "wheelchair_accessible", "wheelchair_provided",
      "pets_allowed", "pets_on_property", "mattress_cost_child", "mattress_cost_adult",
      "cot_cost", "rule_description"
    ];

    const values = fields.map(field => {
      if (field === "user_id") return user_id;
      if (field === "property_id") return data.property_id;
      return data[field] ?? null;
    });

    const placeholders = fields.map(() => "?").join(", ");
    const sql = `INSERT INTO property_rules (${fields.join(", ")}) VALUES (${placeholders})`;

    const [result] = await db.query(sql, values);
    return { id: result.insertId, ...data, user_id };
  }

  // Update rules by ID
  static async updateRulesById(id, data) {
    const keys = Object.keys(data);
    if (keys.length === 0) throw new Error("No data to update");

    const setClause = keys.map(key => `${key} = ?`).join(", ");
    const values = [...keys.map(key => data[key]), id];

    const [result] = await db.query(`UPDATE property_rules SET ${setClause} WHERE id = ?`, values);
    if (result.affectedRows === 0) throw new Error("Property rules not found");

    return { id, ...data };
  }

  // Delete rules by ID
  static async deleteRulesById(id) {
    const [result] = await db.query('DELETE FROM property_rules WHERE id = ?', [id]);
    if (result.affectedRows === 0) throw new Error("Property rules not found");
  }
}

module.exports = PropertyRules;
