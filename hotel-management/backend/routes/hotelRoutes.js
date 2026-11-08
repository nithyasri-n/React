import express from "express";
import { pool } from "../config/db.js";
import upload from "../config/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, minPrice, maxPrice, limit, offset } = req.query;

    const conditions = [];
    const values = [];

    if (search && search.trim() !== "") {
      values.push(`%${search.trim()}%`);
      conditions.push(`name ILIKE $${values.length}`);
    }

    if (minPrice !== undefined && minPrice !== "") {
      const min = Number(minPrice);

      if (!Number.isFinite(min) || min < 0) {
        return res.status(400).json({
          message: "Invalid minimum price",
        });
      }

      values.push(min);
      conditions.push(`price >= $${values.length}`);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      const max = Number(maxPrice);

      if (!Number.isFinite(max) || max < 0) {
        return res.status(400).json({
          message: "Invalid maximum price",
        });
      }

      values.push(max);
      conditions.push(`price <= $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM hotels ${whereClause}`,
      values,
    );

    const total = Number(countResult.rows[0].count);

    let query = `SELECT * FROM hotels ${whereClause} ORDER BY id DESC`;
    const queryValues = [...values];

    if (limit !== undefined || offset !== undefined) {
      const pageLimit = limit === undefined ? 6 : Number(limit);

      const pageOffset = offset === undefined ? 0 : Number(offset);

      if (
        !Number.isInteger(pageLimit) ||
        pageLimit < 1 ||
        pageLimit > 100 ||
        !Number.isInteger(pageOffset) ||
        pageOffset < 0
      ) {
        return res.status(400).json({
          message: "Invalid pagination parameters",
        });
      }

      queryValues.push(pageLimit);
      query += ` LIMIT $${queryValues.length}`;

      queryValues.push(pageOffset);
      query += ` OFFSET $${queryValues.length}`;
    }

    const result = await pool.query(query, queryValues);

    res.set("X-Total-Count", String(total));

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching hotels:", error);

    res.status(500).json({
      message: "Failed to fetch hotels",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching hotel:", error);

    res.status(500).json({
      message: "Failed to fetch hotel",
    });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, latitude, longitude, price } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      latitude === undefined ||
      longitude === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required hotel details",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const hotelPrice = Number(price);

    if (
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90 ||
      !Number.isFinite(lng) ||
      lng < -180 ||
      lng > 180 ||
      !Number.isFinite(hotelPrice) ||
      hotelPrice <= 0
    ) {
      return res.status(400).json({
        message: "Please provide valid coordinates and price",
      });
    }

    const image = req.file ? req.file.filename : null;

    const result = await pool.query(
      `INSERT INTO hotels
       (name, description, latitude, longitude, price, image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name.trim(), description.trim(), lat, lng, hotelPrice, image],
    );

    res.status(201).json({
      message: "Hotel added successfully!",
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding hotel:", error);

    res.status(500).json({
      message: "Failed to add hotel",
    });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, latitude, longitude, price } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      latitude === undefined ||
      longitude === undefined ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required hotel details",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const hotelPrice = Number(price);

    if (
      !Number.isFinite(lat) ||
      lat < -90 ||
      lat > 90 ||
      !Number.isFinite(lng) ||
      lng < -180 ||
      lng > 180 ||
      !Number.isFinite(hotelPrice) ||
      hotelPrice <= 0
    ) {
      return res.status(400).json({
        message: "Please provide valid coordinates and price",
      });
    }

    const image = req.file ? req.file.filename : null;

    const result = await pool.query(
      `UPDATE hotels
       SET name = $1,
           description = $2,
           latitude = $3,
           longitude = $4,
           price = $5,
           image = COALESCE($6, image)
       WHERE id = $7
       RETURNING *`,
      [name.trim(), description.trim(), lat, lng, hotelPrice, image, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json({
      message: "Hotel updated successfully!",
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating hotel:", error);

    res.status(500).json({
      message: "Failed to update hotel",
    });
  }
});

// DELETE - Remove a hotel
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM hotels WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json({
      message: "Hotel deleted successfully!",
      hotel: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);

    res.status(500).json({
      message: "Failed to delete hotel",
    });
  }
});

export default router;
