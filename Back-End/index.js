// import express from "express";
const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://progresstracker-production.up.railway.app/",
    ],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

app.get("/:lesson", async (req, res) => {
  try {
    const course = req.params.lesson;
    const query = `SELECT * FROM ${course}`;
    const [results] = await db.promise().query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch lessons from ${lesson}` });
  }
});

app.put("/:course/:id", async (req, res) => {
  try {
    const course = req.params.course;
    const lessonId = req.params.id;
    const updates = req.body; // This will be something like { completed: 1 }

    //just to make sure we have the correct course names
    const allowedCourses = ["angular", "frontend", "backend"];
    if (!allowedCourses.includes(course)) {
      return res.status(400).json({ error: "Invalid course name." });
    }

    const allowedFields = ["lesson_title", "hours", "minutes", "completed"]; // optional: sanitize input
    const fields = Object.keys(updates).filter((field) =>
      allowedFields.includes(field)
    );

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update." });
    }

    //this is a bit redundant now since I only update one value, but it will be useful in the future when I need to update (or directly assing) multiple values
    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field]);

    const query = `UPDATE ${course} SET ${setClause} WHERE id = ?`;

    await db.promise().query(query, [...values, lessonId]);

    res.json({
      message: `Lesson ${lessonId} updated successfully in course '${course}'.`,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update lesson." });
  }
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
    return;
  }
  console.log(`Server is running on port ${PORT}`);
});
