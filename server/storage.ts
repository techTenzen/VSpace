import { db } from "@db";
import { activities, courses, flashcardDecks, flashcards, ideas, semesters, skills, subjects, users } from "@shared/schema";
import { InsertUser, UpdateUserProfile } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "@db";

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<any>;
  getUser(id: number): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  updateUserProfile(userId: number, profileData: UpdateUserProfile): Promise<any>;
  completeOnboarding(userId: number, onboardingData: any): Promise<any>;
  
  // Skills methods
  createSkill(userId: number, skillData: any): Promise<any>;
  getUserSkills(userId: number): Promise<any[]>;
  updateSkill(skillId: number, userId: number, skillData: any): Promise<any>;
  deleteSkill(skillId: number, userId: number): Promise<void>;
  
  // Subjects/Attendance methods
  createSubject(userId: number, subjectData: any): Promise<any>;
  getUserSubjects(userId: number): Promise<any[]>;
  updateSubject(subjectId: number, userId: number, subjectData: any): Promise<any>;
  updateSubjectAttendance(subjectId: number, userId: number, attended: boolean): Promise<any>;
  deleteSubject(subjectId: number, userId: number): Promise<void>;
  archiveSubject(subjectId: number, userId: number): Promise<any>;
  
  // Semesters/CGPA methods
  createSemester(userId: number, semesterData: any): Promise<any>;
  updateSemester(semesterId: number, userId: number, semesterData: any): Promise<any>;
  getUserSemesters(userId: number): Promise<any[]>;
  getSemesterWithCourses(semesterId: number, userId: number): Promise<any>;
  createCourse(semesterId: number, courseData: any): Promise<any>;
  updateCourse(courseId: number, courseData: any): Promise<any>;
  deleteCourse(courseId: number, userId: number): Promise<void>;
  
  // Ideas methods
  createIdea(userId: number, ideaData: any): Promise<any>;
  getAllIdeas(): Promise<any[]>;
  getUserIdeas(userId: number): Promise<any[]>;
  deleteIdea(ideaId: number, userId: number): Promise<void>;
  
  // Flashcards methods
  getFlashcardDecks(): Promise<any[]>;
  getFlashcardsByDeck(deckId: number): Promise<any[]>;
  
  // Activity methods
  recordActivity(userId: number, type: string, description: string, metadata?: string): Promise<any>;
  getUserActivities(userId: number, limit?: number): Promise<any[]>;
  
  // Session store
  sessionStore: any;
}

class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'user_sessions'
    });
  }
  
  // User methods
  async createUser(userData: InsertUser) {
    const [user] = await db.insert(users).values(userData).returning({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      department: users.department,
      joiningYear: users.joiningYear,
      rollNumber: users.rollNumber,
      gender: users.gender,
      phoneNumber: users.phoneNumber,
      isOnboardingComplete: users.isOnboardingComplete,
      createdAt: users.createdAt,
    });
    return user;
  }
  
  async getUser(id: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false,
      }
    });
  }
  
  async getUserByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }
  
  async updateUserProfile(userId: number, profileData: UpdateUserProfile) {
    const [updatedUser] = await db.update(users)
      .set({ 
        ...profileData, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        department: users.department,
        joiningYear: users.joiningYear,
        rollNumber: users.rollNumber,
        gender: users.gender,
        phoneNumber: users.phoneNumber,
        isOnboardingComplete: users.isOnboardingComplete,
      });

    return updatedUser;
  }
  
  async completeOnboarding(userId: number, onboardingData: any) {
    const { fullName, department, joiningYear, rollNumber, gender, phoneNumber, skills: userSkills } = onboardingData;
    
    // Update user profile
    const [updatedUser] = await db.update(users)
      .set({ 
        fullName, 
        department, 
        joiningYear, 
        rollNumber, 
        gender, 
        phoneNumber, 
        isOnboardingComplete: true,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        department: users.department,
        joiningYear: users.joiningYear,
        rollNumber: users.rollNumber,
        gender: users.gender,
        phoneNumber: users.phoneNumber,
        isOnboardingComplete: users.isOnboardingComplete,
      });
    
    // Add skills if provided
    if (userSkills && userSkills.length > 0) {
      const skillsToInsert = userSkills.map((skill: any) => ({
        userId,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        notes: skill.notes || '',
      }));
      
      await db.insert(skills).values(skillsToInsert);
      
      // Record activity
      await this.recordActivity(
        userId,
        'skill',
        `Added ${skillsToInsert.length} skills during onboarding`
      );
    }
    
    return updatedUser;
  }
  
  // Skills methods
  async createSkill(userId: number, skillData: any) {
    const [newSkill] = await db.insert(skills)
      .values({
        userId,
        ...skillData
      })
      .returning();
    
    await this.recordActivity(
      userId,
      'skill',
      `Added new skill: ${skillData.name}`
    );
    
    return newSkill;
  }
  
  async getUserSkills(userId: number) {
    console.log("getUserSkills called with userId:", userId);
    
    if (!userId) {
      console.error("getUserSkills called with invalid userId:", userId);
      return [];
    }
    
    const userSkills = await db.query.skills.findMany({
      where: eq(skills.userId, userId),
      orderBy: [desc(skills.updatedAt)],
    });
    
    console.log("Found", userSkills.length, "skills for user");
    
    // Extra validation to ensure we're only returning the requested user's skills
    const filteredSkills = userSkills.filter(s => s.userId === userId);
    
    if (filteredSkills.length !== userSkills.length) {
      console.error("Data isolation issue detected - some skills didn't match user ID!");
    }
    
    return filteredSkills;
  }
  
  async updateSkill(skillId: number, userId: number, skillData: any) {
    const [skill] = await db.select().from(skills).where(
      and(
        eq(skills.id, skillId),
        eq(skills.userId, userId)
      )
    );
    
    if (!skill) {
      throw new Error('Skill not found or not owned by user');
    }
    
    const [updatedSkill] = await db.update(skills)
      .set({
        ...skillData,
        updatedAt: new Date()
      })
      .where(eq(skills.id, skillId))
      .returning();
    
    await this.recordActivity(
      userId,
      'skill',
      `Updated skill: ${updatedSkill.name}`
    );
    
    return updatedSkill;
  }
  
  async deleteSkill(skillId: number, userId: number) {
    const [skill] = await db.select().from(skills).where(
      and(
        eq(skills.id, skillId),
        eq(skills.userId, userId)
      )
    );
    
    if (!skill) {
      throw new Error('Skill not found or not owned by user');
    }
    
    await db.delete(skills).where(eq(skills.id, skillId));
    
    await this.recordActivity(
      userId,
      'skill',
      `Deleted skill: ${skill.name}`
    );
  }
  
  // Subjects/Attendance methods
  async createSubject(userId: number, subjectData: any) {
    const [newSubject] = await db.insert(subjects)
      .values({
        userId,
        ...subjectData
      })
      .returning();
    
    await this.recordActivity(
      userId,
      'attendance',
      `Added new subject: ${subjectData.name}`
    );
    
    return newSubject;
  }
  
  async getUserSubjects(userId: number) {
    console.log("getUserSubjects called with userId:", userId);
    
    if (!userId) {
      console.error("getUserSubjects called with invalid userId:", userId);
      return [];
    }
    
    const userSubjects = await db.query.subjects.findMany({
      where: and(
        eq(subjects.userId, userId),
        eq(subjects.isArchived, false)
      ),
      orderBy: [desc(subjects.updatedAt)],
    });
    
    console.log("Query result:", userSubjects.map(s => ({ id: s.id, name: s.name, userId: s.userId })));
    
    // Extra validation to ensure we're only returning the requested user's subjects
    const filteredSubjects = userSubjects.filter(s => s.userId === userId);
    
    if (filteredSubjects.length !== userSubjects.length) {
      console.error("Data isolation issue detected - some subjects didn't match user ID!");
    }
    
    return filteredSubjects;
  }
  
  async updateSubject(subjectId: number, userId: number, subjectData: any) {
    const [subject] = await db.select().from(subjects).where(
      and(
        eq(subjects.id, subjectId),
        eq(subjects.userId, userId)
      )
    );
    
    if (!subject) {
      throw new Error('Subject not found or not owned by user');
    }
    
    const [updatedSubject] = await db.update(subjects)
      .set({
        ...subjectData,
        updatedAt: new Date()
      })
      .where(eq(subjects.id, subjectId))
      .returning();
    
    return updatedSubject;
  }
  
  async updateSubjectAttendance(subjectId: number, userId: number, attended: boolean) {
    const [subject] = await db.select().from(subjects).where(
      and(
        eq(subjects.id, subjectId),
        eq(subjects.userId, userId)
      )
    );
    
    if (!subject) {
      throw new Error('Subject not found or not owned by user');
    }
    
    const updatedAttended = attended ? subject.attendedClasses + 1 : subject.attendedClasses;
    const updatedTotal = subject.totalClasses + 1;
    
    const [updatedSubject] = await db.update(subjects)
      .set({
        attendedClasses: updatedAttended,
        totalClasses: updatedTotal,
        updatedAt: new Date()
      })
      .where(eq(subjects.id, subjectId))
      .returning();
    
    await this.recordActivity(
      userId,
      'attendance',
      `Marked ${attended ? 'present' : 'absent'} for ${subject.name}`,
      JSON.stringify({ attended, current: `${updatedAttended}/${updatedTotal}` })
    );
    
    return updatedSubject;
  }
  
  async deleteSubject(subjectId: number, userId: number) {
    const [subject] = await db.select().from(subjects).where(
      and(
        eq(subjects.id, subjectId),
        eq(subjects.userId, userId)
      )
    );
    
    if (!subject) {
      throw new Error('Subject not found or not owned by user');
    }
    
    await db.delete(subjects).where(eq(subjects.id, subjectId));
    
    await this.recordActivity(
      userId,
      'attendance',
      `Deleted subject: ${subject.name}`
    );
  }
  
  async archiveSubject(subjectId: number, userId: number) {
    const [subject] = await db.select().from(subjects).where(
      and(
        eq(subjects.id, subjectId),
        eq(subjects.userId, userId)
      )
    );
    
    if (!subject) {
      throw new Error('Subject not found or not owned by user');
    }
    
    const [updatedSubject] = await db.update(subjects)
      .set({
        isArchived: true,
        updatedAt: new Date()
      })
      .where(eq(subjects.id, subjectId))
      .returning();
    
    await this.recordActivity(
      userId,
      'attendance',
      `Archived subject: ${subject.name}`
    );
    
    return updatedSubject;
  }
  
  // Semesters/CGPA methods
  async createSemester(userId: number, semesterData: any) {
    const [newSemester] = await db.insert(semesters)
      .values({
        userId,
        ...semesterData
      })
      .returning();
    
    await this.recordActivity(
      userId,
      'gpa',
      `Added new semester: ${semesterData.name}`
    );
    
    return newSemester;
  }
  
  async updateSemester(semesterId: number, userId: number, semesterData: any) {
    // Verify ownership
    const [semester] = await db.select().from(semesters).where(
      and(
        eq(semesters.id, semesterId),
        eq(semesters.userId, userId)
      )
    );
    
    if (!semester) {
      throw new Error('Semester not found or not owned by user');
    }
    
    const [updatedSemester] = await db.update(semesters)
      .set({
        ...semesterData,
        updatedAt: new Date()
      })
      .where(eq(semesters.id, semesterId))
      .returning();
    
    await this.recordActivity(
      userId,
      'gpa',
      `Updated semester: ${semesterData.name}`
    );
    
    return updatedSemester;
  }
  
  async getUserSemesters(userId: number) {
    console.log("getUserSemesters called with userId:", userId);
    
    if (!userId) {
      console.error("getUserSemesters called with invalid userId:", userId);
      return [];
    }
    
    const userSemesters = await db.query.semesters.findMany({
      where: eq(semesters.userId, userId),
      orderBy: [desc(semesters.createdAt)],
      with: {
        courses: true
      }
    });
    
    console.log("Found", userSemesters.length, "semesters for user");
    
    // Extra validation to ensure we're only returning the requested user's semesters
    const filteredSemesters = userSemesters.filter(s => s.userId === userId);
    
    if (filteredSemesters.length !== userSemesters.length) {
      console.error("Data isolation issue detected - some semesters didn't match user ID!");
    }
    
    return filteredSemesters;
  }
  
  async getSemesterWithCourses(semesterId: number, userId: number) {
    const semester = await db.query.semesters.findFirst({
      where: and(
        eq(semesters.id, semesterId),
        eq(semesters.userId, userId)
      ),
      with: {
        courses: true
      }
    });
    
    if (!semester) {
      throw new Error('Semester not found or not owned by user');
    }
    
    return semester;
  }
  
  async createCourse(semesterId: number, courseData: any) {
    // First verify semester ownership
    const semester = await db.query.semesters.findFirst({
      where: and(
        eq(semesters.id, semesterId),
        eq(semesters.userId, courseData.userId)
      ),
    });
    
    if (!semester) {
      throw new Error('Semester not found or not owned by user');
    }
    
    const [newCourse] = await db.insert(courses)
      .values({
        semesterId,
        ...courseData
      })
      .returning();
    
    await this.recordActivity(
      semester.userId,
      'gpa',
      `Added course ${courseData.name} to ${semester.name}`,
      JSON.stringify({ grade: courseData.grade, credits: courseData.credits })
    );
    
    return newCourse;
  }
  
  async updateCourse(courseId: number, courseData: any) {
    // First get the course
    const [course] = await db.select()
      .from(courses)
      .where(eq(courses.id, courseId));
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Now check if the semester belongs to the user
    const semester = await db.query.semesters.findFirst({
      where: and(
        eq(semesters.id, course.semesterId),
        eq(semesters.userId, courseData.userId)
      )
    });
    
    if (!semester) {
      throw new Error('Course not found or not owned by user');
    }
    
    const [updatedCourse] = await db.update(courses)
      .set({
        ...courseData,
        updatedAt: new Date()
      })
      .where(eq(courses.id, courseId))
      .returning();
    
    return updatedCourse;
  }
  
  async deleteCourse(courseId: number, userId: number) {
    // First get the course
    const [course] = await db.select()
      .from(courses)
      .where(eq(courses.id, courseId));
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    // Now check if the semester belongs to the user
    const semester = await db.query.semesters.findFirst({
      where: and(
        eq(semesters.id, course.semesterId),
        eq(semesters.userId, userId)
      )
    });
    
    if (!semester) {
      throw new Error('Course not found or not owned by user');
    }
    
    await db.delete(courses).where(eq(courses.id, courseId));
  }
  
  // Ideas methods
// In storage.ts

  async createIdea(userId: number, ideaData: any) {
    const [newIdea] = await db.insert(ideas)
        .values({ userId, ...ideaData })
        .returning();

    // Fetch user data explicitly
    const userData = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true, fullName: true, email: true, department: true }
    });

    return { ...newIdea, user: userData }; // Attach user data
  }

  async getAllIdeas() {
    const allIdeas = await db.query.ideas.findMany({
      orderBy: [desc(ideas.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            fullName: true,
            email: true,
            department: true
          }
        }
      }
    });
    return allIdeas;
  }

  async getUserIdeas(userId: number) {
    console.log("getUserIdeas called with userId:", userId);
    
    if (!userId) {
      console.error("getUserIdeas called with invalid userId:", userId);
      return [];
    }
    
    const userIdeas = await db.query.ideas.findMany({
      where: eq(ideas.userId, userId),
      orderBy: [desc(ideas.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            fullName: true,
            email: true,
            department: true
          }
        }
      }
    });
    
    console.log("Found", userIdeas.length, "ideas for user");
    
    // Extra validation to ensure we're only returning the requested user's ideas
    const filteredIdeas = userIdeas.filter(idea => idea.userId === userId);
    
    if (filteredIdeas.length !== userIdeas.length) {
      console.error("Data isolation issue detected - some ideas didn't match user ID!");
    }
    
    return filteredIdeas;
  }
  
  async deleteIdea(ideaId: number, userId: number) {
    const [idea] = await db.select().from(ideas).where(
      and(
        eq(ideas.id, ideaId),
        eq(ideas.userId, userId)
      )
    );
    
    if (!idea) {
      throw new Error('Idea not found or not owned by user');
    }
    
    await db.delete(ideas).where(eq(ideas.id, ideaId));
  }
  
  // Flashcards methods
  async getFlashcardDecks() {
    return await db.query.flashcardDecks.findMany({
      orderBy: [desc(flashcardDecks.name)]
    });
  }
  
  async getFlashcardsByDeck(deckId: number) {
    return await db.query.flashcards.findMany({
      where: eq(flashcards.deckId, deckId)
    });
  }
  
  // Activity methods
  async recordActivity(userId: number, type: string, description: string, metadata?: string) {
    const [activity] = await db.insert(activities)
      .values({
        userId,
        type,
        description,
        metadata
      })
      .returning();
    
    return activity;
  }
  
  async getUserActivities(userId: number, limit: number = 10) {
    return await db.query.activities.findMany({
      where: eq(activities.userId, userId),
      orderBy: [desc(activities.createdAt)],
      limit
    });
  }
}

export const storage = new DatabaseStorage();
