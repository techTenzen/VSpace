import { pgTable, text, serial, integer, boolean, timestamp, decimal, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  department: text("department"),
  joiningYear: text("joining_year"),
  rollNumber: text("roll_number"),
  gender: text("gender"),
  phoneNumber: text("phone_number"),
  profilePicture: text("profile_picture"),
  isOnboardingComplete: boolean("is_onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Skills table
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'Technical', 'Soft Skills', etc.
  proficiency: integer("proficiency").notNull(), // 1-5 rating
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subjects for attendance tracking
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  attendedClasses: integer("attended_classes").notNull(),
  totalClasses: integer("total_classes").notNull(),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Semesters for CGPA calculation
export const semesters = pgTable("semesters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(), // e.g., "Semester 1", "Fall 2023"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Courses within semesters
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  semesterId: integer("semester_id").references(() => semesters.id).notNull(),
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
  grade: text("grade").notNull(), // 'S', 'A', 'B', 'C', 'D', 'E', 'F'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ideas for the idea wall
export const ideas = pgTable("ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Flashcards for learning
export const flashcardDecks = pgTable("flashcard_decks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(), // 'Java', 'SQL', 'OOPs', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").references(() => flashcardDecks.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activities for user tracking
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'skill', 'attendance', 'gpa', 'idea'
  description: text("description").notNull(),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
  subjects: many(subjects),
  semesters: many(semesters),
  ideas: many(ideas),
  activities: many(activities),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, { fields: [skills.userId], references: [users.id] }),
}));

export const subjectsRelations = relations(subjects, ({ one }) => ({
  user: one(users, { fields: [subjects.userId], references: [users.id] }),
}));

export const semestersRelations = relations(semesters, ({ one, many }) => ({
  user: one(users, { fields: [semesters.userId], references: [users.id] }),
  courses: many(courses),
}));

export const coursesRelations = relations(courses, ({ one }) => ({
  semester: one(semesters, { fields: [courses.semesterId], references: [semesters.id] }),
}));

export const ideasRelations = relations(ideas, ({ one }) => ({
  user: one(users, { fields: [ideas.userId], references: [users.id] }),
}));

export const flashcardDecksRelations = relations(flashcardDecks, ({ many }) => ({
  flashcards: many(flashcards),
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  deck: one(flashcardDecks, { fields: [flashcards.deckId], references: [flashcardDecks.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, { fields: [activities.userId], references: [users.id] }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("Please enter a valid email"),
  password: (schema) => schema.min(8, "Password must be at least 8 characters"),
}).omit({ createdAt: true, updatedAt: true, isOnboardingComplete: true, profilePicture: true });

export const updateUserProfileSchema = createInsertSchema(users, {
  fullName: (schema) => schema.min(2, "Name must be at least 2 characters"),
  phoneNumber: (schema) => schema.optional(),
}).omit({ email: true, password: true, createdAt: true, updatedAt: true, isOnboardingComplete: true, id: true, profilePicture: true });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const insertSkillSchema = createInsertSchema(skills, {
  name: (schema) => schema.min(2, "Skill name must be at least 2 characters"),
  proficiency: (schema) => schema.min(1).max(5, "Proficiency must be between 1 and 5"),
}).omit({ createdAt: true, updatedAt: true, userId: true });

export const insertSubjectSchema = createInsertSchema(subjects, {
  name: (schema) => schema.min(2, "Subject name must be at least 2 characters"),
}).omit({ createdAt: true, updatedAt: true, userId: true, isArchived: true });

export const updateSubjectAttendanceSchema = z.object({
  id: z.number(),
  attended: z.boolean(),
});

export const insertSemesterSchema = createInsertSchema(semesters, {
  name: (schema) => schema.min(2, "Semester name must be at least 2 characters"),
}).omit({ createdAt: true, updatedAt: true, userId: true });

export const insertCourseSchema = createInsertSchema(courses, {
  name: (schema) => schema.min(2, "Course name must be at least 2 characters"),
  credits: (schema) => schema.min(1).max(10, "Credits must be between 1 and 10"),
  grade: (schema) => schema.refine((val) => ["S", "A", "B", "C", "D", "E", "F"].includes(val), {
    message: "Grade must be one of: S, A, B, C, D, E, F",
  }),
}).omit({ createdAt: true, updatedAt: true });

export const insertIdeaSchema = createInsertSchema(ideas, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
}).omit({ createdAt: true, updatedAt: true, userId: true });

// Define custom types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type UpdateSubjectAttendance = z.infer<typeof updateSubjectAttendanceSchema>;

export type Semester = typeof semesters.$inferSelect;
export type InsertSemester = z.infer<typeof insertSemesterSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = z.infer<typeof insertIdeaSchema>;

export type FlashcardDeck = typeof flashcardDecks.$inferSelect;
export type Flashcard = typeof flashcards.$inferSelect;

export type Activity = typeof activities.$inferSelect;
