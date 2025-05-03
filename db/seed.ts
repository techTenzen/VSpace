import { db } from "./index";
import * as schema from "@shared/schema";
import { hashPassword } from "../server/auth";

async function seed() {
  try {
    console.log("Seeding database...");
    
    // Seed flashcard decks and cards
    const existingDecks = await db.query.flashcardDecks.findMany();
    
    if (existingDecks.length === 0) {
      console.log("Seeding flashcard decks...");
      
      const deckData = [
        { name: "Java Programming Basics", subject: "Java" },
        { name: "SQL Fundamentals", subject: "SQL" },
        { name: "Object-Oriented Programming", subject: "OOPs" },
        { name: "Database Management", subject: "DBMS" },
        { name: "Human Resources", subject: "HR" }
      ];
      
      for (const deck of deckData) {
        const [insertedDeck] = await db.insert(schema.flashcardDecks).values(deck).returning();
        
        // Add cards for each deck
        const cards = getCardsForDeck(insertedDeck.subject);
        
        if (cards.length > 0) {
          const cardsToInsert = cards.map(card => ({
            deckId: insertedDeck.id,
            question: card.question,
            answer: card.answer
          }));
          
          await db.insert(schema.flashcards).values(cardsToInsert);
        }
      }
      
      console.log("Flashcard decks and cards seeded successfully!");
    } else {
      console.log("Flashcard decks already exist, skipping seed.");
    }
  }
  catch (error) {
    console.error("Error seeding database:", error);
  }
}

function getCardsForDeck(subject: string): { question: string; answer: string }[] {
  switch (subject) {
    case "Java":
      return [
        {
          question: "What is a JVM?",
          answer: "Java Virtual Machine - an abstract machine that enables your computer to run a Java program."
        },
        {
          question: "What are the main features of Java?",
          answer: "Object-Oriented, Platform Independent, Simple, Secure, Architecture-neutral, Portable, Robust, Multi-threaded"
        },
        {
          question: "What is the difference between JDK, JRE, and JVM?",
          answer: "JDK (Java Development Kit) includes development tools, JRE (Java Runtime Environment) provides libraries and JVM, and JVM (Java Virtual Machine) executes Java bytecode."
        },
        {
          question: "What is the main method signature in Java?",
          answer: "public static void main(String[] args)"
        },
        {
          question: "What are Java access modifiers?",
          answer: "public, protected, default (no modifier), and private"
        },
        {
          question: "What is a constructor in Java?",
          answer: "A special method used to initialize objects with the same name as the class"
        },
        {
          question: "What is method overloading?",
          answer: "Multiple methods with the same name but different parameters in the same class"
        },
        {
          question: "What is method overriding?",
          answer: "Subclass provides a specific implementation of a method already defined in its parent class"
        },
        {
          question: "What is the difference between == and .equals() in Java?",
          answer: "== compares object references, .equals() compares the content of objects"
        },
        {
          question: "What are Java Exceptions?",
          answer: "Events that disrupt the normal flow of program execution, categorized as checked and unchecked exceptions"
        }
      ];
    case "SQL":
      return [
        {
          question: "What is SQL?",
          answer: "Structured Query Language - a domain-specific language used for managing relational databases"
        },
        {
          question: "What are the main categories of SQL commands?",
          answer: "DDL (Data Definition Language), DML (Data Manipulation Language), DCL (Data Control Language), TCL (Transaction Control Language)"
        },
        {
          question: "What is a primary key?",
          answer: "A column or set of columns that uniquely identifies each row in a table"
        },
        {
          question: "What is a foreign key?",
          answer: "A field in one table that refers to the primary key in another table"
        },
        {
          question: "What is the difference between DELETE and TRUNCATE?",
          answer: "DELETE is a DML command that can filter rows and is logged, TRUNCATE is a DDL command that removes all rows and is not logged"
        },
        {
          question: "What are SQL joins?",
          answer: "Operations used to combine rows from two or more tables based on a related column"
        },
        {
          question: "Name the different types of joins in SQL.",
          answer: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN, SELF JOIN, CROSS JOIN"
        },
        {
          question: "What is normalization?",
          answer: "Process of organizing data to minimize redundancy and dependency by dividing larger tables into smaller ones"
        },
        {
          question: "What is an index in SQL?",
          answer: "A data structure that improves the speed of data retrieval operations on a table"
        },
        {
          question: "What is a stored procedure?",
          answer: "A prepared SQL code that can be saved and reused multiple times"
        }
      ];
    case "OOPs":
      return [
        {
          question: "What is Object-Oriented Programming?",
          answer: "A programming paradigm based on the concept of objects that contain data and code"
        },
        {
          question: "What are the four main principles of OOP?",
          answer: "Encapsulation, Inheritance, Polymorphism, and Abstraction"
        },
        {
          question: "What is encapsulation?",
          answer: "Bundling of data with methods that operate on that data, restricting direct access to some object's components"
        },
        {
          question: "What is inheritance?",
          answer: "Mechanism where a new class inherits properties and behaviors from an existing class"
        },
        {
          question: "What is polymorphism?",
          answer: "Ability of different objects to respond in a unique way to the same method call"
        },
        {
          question: "What is abstraction?",
          answer: "Process of hiding implementation details and showing only functionality to the user"
        },
        {
          question: "What is a class?",
          answer: "A blueprint for creating objects that defines attributes and behaviors"
        },
        {
          question: "What is an object?",
          answer: "An instance of a class that has state and behavior"
        },
        {
          question: "What is method overloading?",
          answer: "Creating multiple methods with the same name but different parameters"
        },
        {
          question: "What is the difference between an abstract class and an interface?",
          answer: "Abstract class can have method implementations and state, interface cannot have state and all methods are implicitly abstract"
        }
      ];
    case "DBMS":
      return [
        {
          question: "What is DBMS?",
          answer: "Database Management System - software for creating and managing databases"
        },
        {
          question: "What is a relational database?",
          answer: "A type of database that organizes data into tables with rows and columns, establishing relationships between tables"
        },
        {
          question: "What is normalization?",
          answer: "Process of organizing database structure to reduce redundancy and improve data integrity"
        },
        {
          question: "What are the ACID properties?",
          answer: "Atomicity, Consistency, Isolation, and Durability - properties that guarantee reliable database transactions"
        },
        {
          question: "What is a transaction?",
          answer: "A sequence of database operations that are executed as a single logical unit of work"
        },
        {
          question: "What is a deadlock?",
          answer: "A situation where two or more transactions are unable to proceed because each holds a lock that the other needs"
        },
        {
          question: "What are the three schema architecture in DBMS?",
          answer: "External schema (user view), Conceptual schema (logical view), and Internal schema (physical view)"
        },
        {
          question: "What is an index in DBMS?",
          answer: "A data structure that improves the speed of data retrieval operations on a database table"
        },
        {
          question: "What is a trigger in DBMS?",
          answer: "A procedural code that is automatically executed in response to certain events on a particular table"
        },
        {
          question: "What is the difference between vertical and horizontal scaling?",
          answer: "Vertical scaling means adding more resources to a single server, horizontal scaling means adding more servers"
        }
      ];
    case "HR":
      return [
        {
          question: "What is Human Resource Management?",
          answer: "The process of managing people in organizations in a structured manner"
        },
        {
          question: "What are the key functions of HR?",
          answer: "Recruitment, training, performance management, compensation and benefits, employee relations, compliance"
        },
        {
          question: "What is the recruitment process?",
          answer: "Identifying, attracting, screening, shortlisting, and interviewing suitable candidates for jobs"
        },
        {
          question: "What is performance appraisal?",
          answer: "A systematic evaluation of an employee's performance and productivity in relation to certain pre-established criteria"
        },
        {
          question: "What is employee engagement?",
          answer: "The emotional commitment the employee has to the organization and its goals"
        },
        {
          question: "What is succession planning?",
          answer: "Process of identifying and developing new leaders who can replace old leaders when they leave"
        },
        {
          question: "What is organizational development?",
          answer: "A planned, organization-wide effort to increase organizational effectiveness through planned interventions"
        },
        {
          question: "What is a 360-degree feedback?",
          answer: "A method of performance appraisal where feedback is gathered from all around an employee"
        },
        {
          question: "What is employee retention?",
          answer: "An organization's ability to keep its employees and reduce turnover"
        },
        {
          question: "What is work-life balance?",
          answer: "A concept including proper prioritization between work (career and ambition) and lifestyle (health, pleasure, leisure, family)"
        }
      ];
    default:
      return [];
  }
}

seed();
