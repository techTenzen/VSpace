import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { and, eq } from "drizzle-orm";
import { InsertSkill, InsertSubject, InsertSemester, InsertCourse, InsertIdea, updateSubjectAttendanceSchema, insertSkillSchema, insertSubjectSchema, insertSemesterSchema, insertCourseSchema, insertIdeaSchema } from "@shared/schema";
import { ZodError } from "zod";

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (login, register, logout, get user)
  setupAuth(app);
  
  // Skills routes
  app.get("/api/skills", isAuthenticated, async (req, res) => {
    try {
      const skills = await storage.getUserSkills(req.user!.id);
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });
  
  app.post("/api/skills", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(req.user!.id, validatedData);
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });
  
  app.put("/api/skills/:id", isAuthenticated, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.updateSkill(skillId, req.user!.id, validatedData);
      res.json(skill);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });
  
  app.delete("/api/skills/:id", isAuthenticated, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      await storage.deleteSkill(skillId, req.user!.id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });
  
  // Subjects/Attendance routes
  app.get("/api/subjects", isAuthenticated, async (req, res) => {
    try {
      console.log("Fetching subjects for user ID:", req.user!.id);
      const subjects = await storage.getUserSubjects(req.user!.id);
      console.log("Found", subjects.length, "subjects for user");
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });
  
  app.post("/api/subjects", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(req.user!.id, validatedData);
      res.status(201).json(subject);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });
  
  app.put("/api/subjects/:id", isAuthenticated, async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const validatedData = insertSubjectSchema.parse(req.body);
      const subject = await storage.updateSubject(subjectId, req.user!.id, validatedData);
      res.json(subject);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating subject:", error);
      res.status(500).json({ message: "Failed to update subject" });
    }
  });
  
  app.patch("/api/subjects/:id/attendance", isAuthenticated, async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const { attended } = req.body;
      const subject = await storage.updateSubjectAttendance(subjectId, req.user!.id, attended);
      res.json(subject);
    } catch (error) {
      console.error("Error updating attendance:", error);
      res.status(500).json({ message: "Failed to update attendance" });
    }
  });
  
  app.delete("/api/subjects/:id", isAuthenticated, async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      await storage.deleteSubject(subjectId, req.user!.id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting subject:", error);
      res.status(500).json({ message: "Failed to delete subject" });
    }
  });
  
  app.patch("/api/subjects/:id/archive", isAuthenticated, async (req, res) => {
    try {
      const subjectId = parseInt(req.params.id);
      const subject = await storage.archiveSubject(subjectId, req.user!.id);
      res.json(subject);
    } catch (error) {
      console.error("Error archiving subject:", error);
      res.status(500).json({ message: "Failed to archive subject" });
    }
  });
  
  // Semesters/CGPA routes
  app.get("/api/semesters", isAuthenticated, async (req, res) => {
    try {
      const semesters = await storage.getUserSemesters(req.user!.id);
      res.json(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      res.status(500).json({ message: "Failed to fetch semesters" });
    }
  });
  
  app.post("/api/semesters", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSemesterSchema.parse(req.body);
      const semester = await storage.createSemester(req.user!.id, validatedData);
      res.status(201).json(semester);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating semester:", error);
      res.status(500).json({ message: "Failed to create semester" });
    }
  });
  
  app.get("/api/semesters/:id", isAuthenticated, async (req, res) => {
    try {
      const semesterId = parseInt(req.params.id);
      const semester = await storage.getSemesterWithCourses(semesterId, req.user!.id);
      res.json(semester);
    } catch (error) {
      console.error("Error fetching semester:", error);
      res.status(500).json({ message: "Failed to fetch semester" });
    }
  });
  
  app.put("/api/semesters/:id", isAuthenticated, async (req, res) => {
    try {
      const semesterId = parseInt(req.params.id);
      const validatedData = insertSemesterSchema.parse(req.body);
      const semester = await storage.updateSemester(semesterId, req.user!.id, validatedData);
      res.json(semester);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating semester:", error);
      res.status(500).json({ message: "Failed to update semester" });
    }
  });
  
  app.post("/api/semesters/:id/courses", isAuthenticated, async (req, res) => {
    try {
      const semesterId = parseInt(req.params.id);
      const validatedData = insertCourseSchema.parse(req.body);
      // Add userId to the request for ownership verification
      const course = await storage.createCourse(semesterId, { ...validatedData, userId: req.user!.id });
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  app.put("/api/courses/:id", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const validatedData = insertCourseSchema.parse(req.body);
      // Add userId to the request for ownership verification
      const course = await storage.updateCourse(courseId, { ...validatedData, userId: req.user!.id });
      res.json(course);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });
  
  app.delete("/api/courses/:id", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      await storage.deleteCourse(courseId, req.user!.id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });
  
  // Ideas routes
// routes/ideas.ts (or inside registerRoutes)
  app.get("/api/ideas", isAuthenticated, async (req, res) => {
    try {
      // Prevent HTTP 304 and stale cache
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      const ideas = await storage.getAllIdeas();
      res.status(200).json(ideas);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      res.status(500).json({ message: "Failed to fetch ideas" });
    }
  });

  app.post("/api/ideas", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertIdeaSchema.parse(req.body);
      const idea = await storage.createIdea(req.user!.id, validatedData);
      res.status(201).json(idea);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error creating idea:", error);
      res.status(500).json({ message: "Failed to create idea" });
    }
  });

  app.delete("/api/ideas/:id", isAuthenticated, async (req, res) => {
    try {
      const ideaId = parseInt(req.params.id);
      await storage.deleteIdea(ideaId, req.user!.id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting idea:", error);
      res.status(500).json({ message: "Failed to delete idea" });
    }
  });


  // Flashcards routes
  app.get("/api/flashcard-decks", async (req, res) => {
    try {
      const decks = await storage.getFlashcardDecks();
      res.json(decks);
    } catch (error) {
      console.error("Error fetching flashcard decks:", error);
      res.status(500).json({ message: "Failed to fetch flashcard decks" });
    }
  });
  
  app.get("/api/flashcard-decks/:id/cards", async (req, res) => {
    try {
      const deckId = parseInt(req.params.id);
      const cards = await storage.getFlashcardsByDeck(deckId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      res.status(500).json({ message: "Failed to fetch flashcards" });
    }
  });
  
  // Activities routes
  app.get("/api/activities", isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getUserActivities(req.user!.id, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
