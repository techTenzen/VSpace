import { useState, useEffect } from "react";
import SidebarNav from "@/components/layout/sidebar-nav";
import MobileNav from "@/components/layout/mobile-nav";
import Flashcard from "@/components/learning/flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, BookOpen, Award, Code, Database, Brain, Clock } from "lucide-react";

// --- 1. All decks and all cards (hardcoded) ---
const decks = [
  { id: 1, name: "Computer Science Core", subject: "CS" },
  { id: 2, name: "Data Structures & Algorithms", subject: "DSA" },
  { id: 3, name: "SQL & Databases", subject: "SQL" },
  { id: 4, name: "Operating Systems", subject: "OS" },
  { id: 5, name: "HR & Behavioral", subject: "HR" },
  { id: 6, name: "Body Language & Soft Skills", subject: "BodyLanguage" },
  { id: 7, name: "Cultural Fit", subject: "CulturalFit" }
];

// All cards, 40 per deck, hardcoded
const allCards = [
  // --- CS Deck (id:1) ---
  { deckId: 1, question: "What is a class in OOP?", answer: "A blueprint for creating objects, defining their properties and behaviors." },
  { deckId: 1, question: "What is a superclass?", answer: "A class from which other classes inherit properties and methods." },
  { deckId: 1, question: "What is a compiler?", answer: "A program that translates source code into machine code." },
  { deckId: 1, question: "What is an interpreter?", answer: "A program that executes code line by line." },
  { deckId: 1, question: "What is the difference between primary and secondary memory?", answer: "Primary memory is volatile and fast (RAM); secondary memory is non-volatile and used for long-term storage (HDD/SSD)." },
  { deckId: 1, question: "What is object-oriented programming?", answer: "A paradigm based on objects and classes to structure software." },
  { deckId: 1, question: "What is encapsulation?", answer: "The bundling of data and methods that operate on the data within one unit, like a class." },
  { deckId: 1, question: "What is inheritance?", answer: "A mechanism where one class acquires properties of another class." },
  { deckId: 1, question: "What is polymorphism?", answer: "The ability of different objects to respond to the same function call in different ways." },
  { deckId: 1, question: "What is abstraction?", answer: "Hiding complex implementation details and showing only the necessary features." },
  { deckId: 1, question: "What is a variable?", answer: "A named storage location for data." },
  { deckId: 1, question: "What is a function?", answer: "A block of code that performs a specific task." },
  { deckId: 1, question: "What is recursion?", answer: "A function calling itself to solve a problem." },
  { deckId: 1, question: "What is a loop?", answer: "A control structure to repeat a block of code multiple times." },
  { deckId: 1, question: "What is a conditional statement?", answer: "A statement that executes code based on a condition (e.g., if-else)." },
  { deckId: 1, question: "What is an array?", answer: "A collection of elements stored in contiguous memory locations." },
  { deckId: 1, question: "What is a pointer?", answer: "A variable that stores the address of another variable." },
  { deckId: 1, question: "What is a stack overflow?", answer: "An error caused by excessive use of stack memory, often due to infinite recursion." },
  { deckId: 1, question: "What is a memory leak?", answer: "Failure to release unused memory, causing reduced available memory." },
  { deckId: 1, question: "What is a framework?", answer: "A reusable set of libraries or tools for software development." },
  { deckId: 1, question: "What is an API?", answer: "A set of functions and protocols for building software." },
  { deckId: 1, question: "What is a library?", answer: "A collection of precompiled routines for use in programs." },
  { deckId: 1, question: "What is software testing?", answer: "The process of evaluating software for correctness and quality." },
  { deckId: 1, question: "What is debugging?", answer: "Finding and fixing errors in code." },
  { deckId: 1, question: "What is version control?", answer: "A system for tracking changes to code over time." },
  { deckId: 1, question: "What is Git?", answer: "A distributed version control system." },
  { deckId: 1, question: "What is a repository?", answer: "A storage location for code and its history." },
  { deckId: 1, question: "What is branching in Git?", answer: "Creating independent lines of development in a repository." },
  { deckId: 1, question: "What is merging in Git?", answer: "Combining changes from different branches." },
  { deckId: 1, question: "What is continuous integration?", answer: "Automatically building and testing code after changes are made." },
  { deckId: 1, question: "What is Agile methodology?", answer: "An iterative approach to software development focused on collaboration and flexibility." },
  { deckId: 1, question: "What is SDLC?", answer: "Software Development Life Cycle-a process for software creation." },
  { deckId: 1, question: "What is UML?", answer: "Unified Modeling Language for visualizing software design." },
  { deckId: 1, question: "What is a flowchart?", answer: "A diagram representing the flow of a program or process." },
  { deckId: 1, question: "What is exception handling?", answer: "Managing errors during program execution." },
  { deckId: 1, question: "What is a database?", answer: "An organized collection of structured data." },
  { deckId: 1, question: "What is normalization?", answer: "Organizing data to reduce redundancy and improve integrity." },
  { deckId: 1, question: "What is a transaction?", answer: "A sequence of database operations treated as a single unit." },
  { deckId: 1, question: "What is cloud computing?", answer: "Delivering computing services over the internet." },
  { deckId: 1, question: "What is API rate limiting?", answer: "Restricting the number of API requests a user can make in a time period." },
  { deckId: 1, question: "What is garbage collection?", answer: "Automatic memory management that reclaims unused memory." },

  // --- DSA Deck (id:2) ---
  { deckId: 2, question: "What is a data structure?", answer: "A way to organize and store data for efficient access and modification." },
  { deckId: 2, question: "What is an algorithm?", answer: "A step-by-step procedure to solve a problem." },
  { deckId: 2, question: "What is an array?", answer: "A collection of elements identified by index." },
  { deckId: 2, question: "What is a linked list?", answer: "A sequence of nodes, each pointing to the next." },
  { deckId: 2, question: "What is a stack?", answer: "A Last-In, First-Out (LIFO) data structure." },
  { deckId: 2, question: "What is a queue?", answer: "A First-In, First-Out (FIFO) data structure." },
  { deckId: 2, question: "What is a tree?", answer: "A hierarchical data structure with nodes and edges." },
  { deckId: 2, question: "What is a binary tree?", answer: "A tree where each node has at most two children." },
  { deckId: 2, question: "What is a binary search tree?", answer: "A binary tree where left child < parent < right child." },
  { deckId: 2, question: "What is a heap?", answer: "A complete binary tree used for priority queues." },
  { deckId: 2, question: "What is a graph?", answer: "A set of nodes connected by edges." },
  { deckId: 2, question: "What is a hash table?", answer: "A structure that maps keys to values for fast lookup." },
  { deckId: 2, question: "What is a doubly linked list?", answer: "A linked list where nodes have pointers to both next and previous nodes." },
  { deckId: 2, question: "What is a circular queue?", answer: "A queue where the last element connects to the first." },
  { deckId: 2, question: "What is time complexity?", answer: "A measure of algorithm's running time as input size grows." },
  { deckId: 2, question: "What is space complexity?", answer: "A measure of memory used by an algorithm." },
  { deckId: 2, question: "What is Big O notation?", answer: "A notation to describe upper bound of algorithm's complexity." },
  { deckId: 2, question: "What is linear search?", answer: "Searching an element by checking each item in sequence." },
  { deckId: 2, question: "What is binary search?", answer: "Searching a sorted array by repeatedly dividing search interval in half." },
  { deckId: 2, question: "What is bubble sort?", answer: "A sorting algorithm that repeatedly swaps adjacent elements if out of order." },
  { deckId: 2, question: "What is selection sort?", answer: "A sorting algorithm that selects the minimum element and moves it to the beginning." },
  { deckId: 2, question: "What is insertion sort?", answer: "A sorting algorithm that builds the sorted array one item at a time." },
  { deckId: 2, question: "What is merge sort?", answer: "A divide-and-conquer sorting algorithm." },
  { deckId: 2, question: "What is quick sort?", answer: "A divide-and-conquer sorting algorithm using a pivot." },
  { deckId: 2, question: "What is a balanced tree?", answer: "A tree where the height difference between left and right subtrees is minimal." },
  { deckId: 2, question: "What is a trie?", answer: "A tree-like data structure for storing strings." },
  { deckId: 2, question: "What is a priority queue?", answer: "A queue where elements are served based on priority." },
  { deckId: 2, question: "What is BFS?", answer: "Breadth-First Search-visits nodes level by level." },
  { deckId: 2, question: "What is DFS?", answer: "Depth-First Search-visits nodes by exploring as far as possible." },
  { deckId: 2, question: "What is a spanning tree?", answer: "A subgraph that connects all nodes without cycles." },
  { deckId: 2, question: "What is Dijkstra’s algorithm?", answer: "An algorithm for finding shortest paths in a graph." },
  { deckId: 2, question: "What is dynamic programming?", answer: "A technique for solving problems by breaking them into subproblems and storing results." },
  { deckId: 2, question: "What is memoization?", answer: "Storing results of expensive function calls for reuse." },
  { deckId: 2, question: "What is a greedy algorithm?", answer: "An algorithm that makes the locally optimal choice at each step." },
  { deckId: 2, question: "What is a hash collision?", answer: "When two keys map to the same index in a hash table." },
  { deckId: 2, question: "What is amortized analysis?", answer: "Average time per operation over a sequence of operations." },
  { deckId: 2, question: "What is a postfix expression?", answer: "An expression where operators follow operands." },
  { deckId: 2, question: "What is a graph cycle?", answer: "A path that starts and ends at the same node." },
  { deckId: 2, question: "What is backtracking?", answer: "A recursive algorithmic technique to solve problems by exploring all possibilities." },
  { deckId: 2, question: "What is a minimum spanning tree?", answer: "A spanning tree with the smallest possible total edge weight." },
  { deckId: 2, question: "What is the difference between BFS and DFS?", answer: "BFS uses a queue and explores level by level; DFS uses a stack and explores depth-wise." },

  // SQL Deck (id:3) - 40 cards
  { deckId: 3, question: "What is SQL?", answer: "Structured Query Language, used to manage and query relational databases." },
  { deckId: 3, question: "What are the types of SQL commands?", answer: "DDL, DML, DCL, TCL." },
  { deckId: 3, question: "What is a primary key?", answer: "A field that uniquely identifies each record in a table." },
  { deckId: 3, question: "What is a foreign key?", answer: "A field in one table that refers to the primary key in another table." },
  { deckId: 3, question: "What is normalization?", answer: "Organizing data to reduce redundancy and improve integrity." },
  { deckId: 3, question: "What is denormalization?", answer: "Combining tables to improve read performance at the cost of redundancy." },
  { deckId: 3, question: "What is a JOIN in SQL?", answer: "Combining rows from two or more tables based on a related column." },
  { deckId: 3, question: "Name types of JOINs.", answer: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN." },
  { deckId: 3, question: "What is the difference between WHERE and HAVING?", answer: "WHERE filters rows before grouping; HAVING filters after grouping." },
  { deckId: 3, question: "What is an index?", answer: "A database object to speed up data retrieval." },
  { deckId: 3, question: "What is a view?", answer: "A virtual table based on the result-set of an SQL statement." },
  { deckId: 3, question: "What is a stored procedure?", answer: "A precompiled collection of SQL statements stored in the database." },
  { deckId: 3, question: "What is a trigger?", answer: "A set of instructions that executes automatically in response to certain events on a table." },
  { deckId: 3, question: "What is a transaction?", answer: "A sequence of operations performed as a single logical unit of work." },
  { deckId: 3, question: "Explain ACID properties.", answer: "Atomicity, Consistency, Isolation, Durability-properties ensuring reliable transactions." },
  { deckId: 3, question: "What is a composite key?", answer: "A key made of two or more columns to uniquely identify a row." },
  { deckId: 3, question: "What is a unique key?", answer: "A constraint that ensures all values in a column are unique." },
  { deckId: 3, question: "Difference between UNION and UNION ALL?", answer: "UNION removes duplicates; UNION ALL includes all records." },
  { deckId: 3, question: "What is a subquery?", answer: "A query nested inside another query." },
  { deckId: 3, question: "What is a correlated subquery?", answer: "A subquery that references columns from the outer query." },
  { deckId: 3, question: "What is a NULL value?", answer: "Represents missing or unknown data in a table." },
  { deckId: 3, question: "What is the LIKE operator used for?", answer: "Pattern matching in WHERE clauses." },
  { deckId: 3, question: "What is the IN operator?", answer: "Specifies multiple values in a WHERE clause." },
  { deckId: 3, question: "What is a constraint?", answer: "A rule enforced on data columns (e.g., NOT NULL, UNIQUE, CHECK, FOREIGN KEY)." },
  { deckId: 3, question: "What is a scalar function?", answer: "A function that returns a single value based on input." },
  { deckId: 3, question: "What is an aggregate function?", answer: "A function that performs calculations on multiple values (SUM, AVG, COUNT, etc.)." },
  { deckId: 3, question: "What is GROUP BY used for?", answer: "To group rows that have the same values in specified columns." },
  { deckId: 3, question: "What is ORDER BY used for?", answer: "To sort the result-set in ascending or descending order." },
  { deckId: 3, question: "What is a database schema?", answer: "The structure that defines tables, fields, and relationships in a database." },
  { deckId: 3, question: "What is a data warehouse?", answer: "A system for reporting and data analysis, storing large amounts of data." },
  { deckId: 3, question: "What is a window function?", answer: "A function that performs calculations across a set of rows related to the current row." },
  { deckId: 3, question: "What is a self join?", answer: "A regular join but the table is joined with itself." },
  { deckId: 3, question: "Difference between DELETE and TRUNCATE?", answer: "DELETE removes rows one at a time; TRUNCATE removes all rows quickly." },
  { deckId: 3, question: "What is an alias in SQL?", answer: "A temporary name given to a table or column in a query." },
  { deckId: 3, question: "What is a clustered index?", answer: "An index that sorts and stores the data rows of the table based on the index key." },
  { deckId: 3, question: "What is a non-clustered index?", answer: "A separate structure from the data rows containing pointers to the data." },
  { deckId: 3, question: "What is database replication?", answer: "Copying and maintaining database objects in multiple databases." },
  { deckId: 3, question: "What is a surrogate key?", answer: "A unique identifier for an entity, not derived from application data." },
  { deckId: 3, question: "Difference between SQL and NoSQL?", answer: "SQL is relational, uses structured tables; NoSQL is non-relational, handles unstructured data." },

  // OS Deck (id:4) - 40 cards
  { deckId: 4, question: "What is an operating system?", answer: "Software that manages hardware and software resources of a computer." },
  { deckId: 4, question: "What are the main functions of an OS?", answer: "Resource management, user interface, file management, device management, scheduling, security." },
  { deckId: 4, question: "What is a kernel?", answer: "The core component of an OS managing system resources." },
  { deckId: 4, question: "What is a process?", answer: "A program in execution." },
  { deckId: 4, question: "Difference between process and thread?", answer: "A thread is a lightweight process; processes are independent." },
  { deckId: 4, question: "What is process scheduling?", answer: "The activity of deciding which process runs at a given time." },
  { deckId: 4, question: "What is context switching?", answer: "Saving and loading process states for multitasking." },
  { deckId: 4, question: "What is a deadlock?", answer: "A situation where processes wait indefinitely for resources." },
  { deckId: 4, question: "Conditions for deadlock?", answer: "Mutual exclusion, hold and wait, no preemption, circular wait." },
  { deckId: 4, question: "What is virtual memory?", answer: "A memory management technique that gives the illusion of more RAM." },
  { deckId: 4, question: "What is paging?", answer: "Dividing memory into fixed-size pages." },
  { deckId: 4, question: "What is segmentation?", answer: "Dividing memory into variable-sized segments." },
  { deckId: 4, question: "What is a file system?", answer: "A way of organizing and storing files on storage devices." },
  { deckId: 4, question: "What is a device driver?", answer: "Software that controls hardware devices." },
  { deckId: 4, question: "What is a system call?", answer: "A request to the OS for a service." },
  { deckId: 4, question: "What is a shell?", answer: "A user interface for accessing OS services." },
  { deckId: 4, question: "What is a real-time OS (RTOS)?", answer: "An OS used for real-time applications with strict timing constraints." },
  { deckId: 4, question: "What is multitasking?", answer: "Running multiple tasks simultaneously." },
  { deckId: 4, question: "What is multiprogramming?", answer: "Keeping multiple programs in memory to improve CPU usage." },
  { deckId: 4, question: "What is a scheduler?", answer: "Software that selects the next process to run." },
  { deckId: 4, question: "What is a dispatcher?", answer: "Transfers control of the CPU to the selected process." },
  { deckId: 4, question: "Preemptive vs Non-preemptive scheduling?", answer: "Preemptive can interrupt processes; non-preemptive cannot." },
  { deckId: 4, question: "What is a race condition?", answer: "When processes access shared data concurrently, leading to unpredictable results." },
  { deckId: 4, question: "What is mutual exclusion?", answer: "Ensuring only one process accesses a resource at a time." },
  { deckId: 4, question: "What is inter-process communication (IPC)?", answer: "Mechanisms for processes to communicate." },
  { deckId: 4, question: "Types of IPC?", answer: "Pipes, message queues, shared memory, semaphores." },
  { deckId: 4, question: "What is a semaphore?", answer: "A synchronization tool for managing resources." },
  { deckId: 4, question: "What is a monitor in OS?", answer: "A synchronization construct for threads." },
  { deckId: 4, question: "What is thrashing?", answer: "Excessive paging causing low performance." },
  { deckId: 4, question: "What is a zombie process?", answer: "A process that has finished execution but still has an entry in the process table." },
  { deckId: 4, question: "What is a bootloader?", answer: "Software that loads the OS at startup." },
  { deckId: 4, question: "What is demand paging?", answer: "Loading pages into memory only when needed." },
  { deckId: 4, question: "What is a microkernel?", answer: "A minimal OS kernel with most services in user space." },
  { deckId: 4, question: "What is a monolithic kernel?", answer: "A kernel where all OS services run in kernel space." },
  { deckId: 4, question: "What is swapping?", answer: "Moving processes between RAM and disk." },
  { deckId: 4, question: "What is a page fault?", answer: "When a program accesses data not in physical memory." },
  { deckId: 4, question: "What is Belady's anomaly?", answer: "More frames causing more page faults in some algorithms." },
  { deckId: 4, question: "What is RAID?", answer: "Redundant Array of Independent Disks for data redundancy." },
  { deckId: 4, question: "What is file fragmentation?", answer: "Non-contiguous storage of file data." },
  { deckId: 4, question: "What is device management in OS?", answer: "Managing input/output devices." },


  { deckId: 5, question: "Tell me about yourself.", answer: "A brief summary of your education, skills, and interests." },
  { deckId: 5, question: "Why should we hire you?", answer: "Highlight your strengths and fit for the role." },
  { deckId: 5, question: "What are your strengths?", answer: "Mention relevant skills and qualities." },
  { deckId: 5, question: "What are your weaknesses?", answer: "Share a real weakness and how you’re improving." },
  { deckId: 5, question: "Why do you want to work here?", answer: "Show knowledge of the company and alignment with its values." },
  { deckId: 5, question: "Where do you see yourself in five years?", answer: "Describe career goals and growth." },
  { deckId: 5, question: "Describe a challenging situation and how you handled it.", answer: "Share a specific example and your actions." },
  { deckId: 5, question: "How do you handle criticism?", answer: "Show openness to feedback." },
  { deckId: 5, question: "How do you prioritize your work?", answer: "Explain your time management methods." },
  { deckId: 5, question: "What motivates you?", answer: "Share what drives you to succeed." },
  { deckId: 5, question: "How do you handle stress?", answer: "Describe your coping strategies." },
  { deckId: 5, question: "Do you prefer working alone or in a team?", answer: "Express flexibility." },
  { deckId: 5, question: "How do you stay updated with industry trends?", answer: "Mention learning methods." },
  { deckId: 5, question: "What are your salary expectations?", answer: "Provide a researched range." },
  { deckId: 5, question: "Why did you choose this career path?", answer: "Explain your interest." },
  { deckId: 5, question: "What do you know about our competitors?", answer: "Show industry awareness." },
  { deckId: 5, question: "How do you handle conflict with a coworker?", answer: "Describe communication and resolution." },
  { deckId: 5, question: "What is your biggest achievement?", answer: "Share a relevant accomplishment." },
  { deckId: 5, question: "Are you willing to relocate?", answer: "State your flexibility." },
  { deckId: 5, question: "When can you start?", answer: "Give your availability." },
  { deckId: 5, question: "What are your hobbies?", answer: "Mention positive, relevant hobbies." },
  { deckId: 5, question: "How did your education prepare you for this job?", answer: "Highlight relevant coursework or projects." },
  { deckId: 5, question: "How do you handle deadlines?", answer: "Discuss planning and prioritization." },
  { deckId: 5, question: "Would you like to pursue higher studies?", answer: "Share your current focus." },
  { deckId: 5, question: "What skills do you want to develop?", answer: "Identify learning goals." },
  { deckId: 5, question: "What is your ideal job?", answer: "Describe your preferred role." },
  { deckId: 5, question: "How do you deal with failure?", answer: "Show resilience." },
  { deckId: 5, question: "What is your leadership style?", answer: "Describe your approach." },
  { deckId: 5, question: "How do you ensure a positive work environment?", answer: "Talk about communication and respect." },
  { deckId: 5, question: "What are your long-term career goals?", answer: "Share your ambitions." },
  { deckId: 5, question: "Do you have any questions for us?", answer: "Prepare thoughtful questions." },
  { deckId: 5, question: "What makes you unique?", answer: "Highlight your differentiators." },
  { deckId: 5, question: "How do you handle multitasking?", answer: "Explain your strategy." },
  { deckId: 5, question: "What is your greatest professional regret?", answer: "Share a learning experience." },
  { deckId: 5, question: "How do you handle ambiguity?", answer: "Describe adaptability." },
  { deckId: 5, question: "What is your decision-making process?", answer: "Explain your approach." },
  { deckId: 5, question: "How do you manage work-life balance?", answer: "Describe your method." },
  { deckId: 5, question: "What are your expectations from this job?", answer: "Share your goals." },
  { deckId: 5, question: "How do you handle repetitive tasks?", answer: "Show motivation and focus." },
  { deckId: 5, question: "How do you celebrate success?", answer: "Describe your approach to achievement." },

  { deckId: 6, question: "Why is good posture important in interviews?", answer: "It shows confidence and professionalism." },
  { deckId: 6, question: "How does eye contact affect an interview?", answer: "It signals engagement and honesty." },
  { deckId: 6, question: "What does a firm handshake communicate?", answer: "Confidence and enthusiasm." },
  { deckId: 6, question: "How do facial expressions impact your performance?", answer: "Positive expressions make you approachable." },
  { deckId: 6, question: "Why avoid crossing your arms?", answer: "It can seem defensive." },
  { deckId: 6, question: "What does fidgeting indicate?", answer: "Nervousness or distraction." },
  { deckId: 6, question: "How can hand gestures be used effectively?", answer: "To emphasize points, but not distract." },
  { deckId: 6, question: "Why mirror the interviewer’s body language?", answer: "It builds rapport." },
  { deckId: 6, question: "What does leaning forward indicate?", answer: "Interest and engagement." },
  { deckId: 6, question: "Why avoid checking your phone or watch?", answer: "It signals impatience or disinterest." },
  { deckId: 6, question: "How can your voice convey confidence?", answer: "By speaking clearly and steadily." },
  { deckId: 6, question: "What does slouching communicate?", answer: "Lack of confidence or interest." },
  { deckId: 6, question: "How to manage nervousness through body language?", answer: "Maintain open posture and controlled gestures." },
  { deckId: 6, question: "What does a blank expression convey?", answer: "Unfriendliness or lack of engagement." },
  { deckId: 6, question: "Why avoid touching your face?", answer: "It can signal discomfort or dishonesty." },
  { deckId: 6, question: "What does leaning back suggest?", answer: "Disengagement." },
  { deckId: 6, question: "How can you use pauses effectively?", answer: "To show thoughtfulness." },
  { deckId: 6, question: "Why avoid defensive or aggressive posture?", answer: "It can seem combative." },
  { deckId: 6, question: "What is the impact of smiling?", answer: "It makes you appear positive." },
  { deckId: 6, question: "How should you sit in relation to the interviewer?", answer: "At a slight angle, not directly facing." },
  { deckId: 6, question: "What does mirroring tone and pace suggest?", answer: "Adaptability." },
  { deckId: 6, question: "How to show attentiveness?", answer: "Nodding and leaning in." },
  { deckId: 6, question: "Why avoid wild hand movements?", answer: "They are distracting." },
  { deckId: 6, question: "How to project openness?", answer: "Keep arms open and relaxed." },
  { deckId: 6, question: "Why avoid shrugging?", answer: "It shows uncertainty." },
  { deckId: 6, question: "What does stiffness in posture indicate?", answer: "Nervousness." },
  { deckId: 6, question: "How to use gestures to enhance answers?", answer: "Use sparingly for emphasis." },
  { deckId: 6, question: "Why maintain a calm demeanor?", answer: "It projects confidence." },
  { deckId: 6, question: "How does body alignment affect rapport?", answer: "It creates harmony." },
  { deckId: 6, question: "What is the effect of being visibly bored?", answer: "It signals lack of interest." },
  { deckId: 6, question: "Why keep your hands visible?", answer: "It builds trust." },
  { deckId: 6, question: "What does nodding indicate?", answer: "Understanding and agreement." },
  { deckId: 6, question: "Why avoid looking around the room?", answer: "It shows distraction." },
  { deckId: 6, question: "How to show you’re listening?", answer: "Maintain eye contact and nod." },
  { deckId: 6, question: "Why avoid tapping fingers?", answer: "It signals impatience." },
  { deckId: 6, question: "What does a relaxed smile communicate?", answer: "Friendliness." },
  { deckId: 6, question: "Why avoid sitting on the edge of your seat?", answer: "It shows anxiety." },
  { deckId: 6, question: "How to use breathing to manage nerves?", answer: "Deep breathing calms you." },
  { deckId: 6, question: "Why avoid playing with objects?", answer: "It distracts the interviewer." },
  { deckId: 6, question: "How to exit the interview confidently?", answer: "Stand, smile, and thank the interviewer." },

  { deckId: 7, question: "What is a 360-degree feedback?", answer: "A method of performance appraisal where feedback is gathered from all around an employee." },
  { deckId: 7, question: "What is employee retention?", answer: "An organization's ability to keep its employees and reduce turnover." },
  { deckId: 7, question: "What is work-life balance?", answer: "A concept including proper prioritization between work (career and ambition) and lifestyle (health, pleasure, leisure, family)." },
  { deckId: 7, question: "What is company culture?", answer: "The shared values, beliefs, and behaviors within an organization." },
  { deckId: 7, question: "What is diversity in the workplace?", answer: "Inclusion of people from different backgrounds, cultures, and perspectives." },
  { deckId: 7, question: "What is inclusion?", answer: "Ensuring all individuals feel valued and integrated into the workplace." },
  { deckId: 7, question: "What is a mission statement?", answer: "A formal summary of the aims and values of a company." },
  { deckId: 7, question: "What is a vision statement?", answer: "A company's long-term goals and aspirations." },
  { deckId: 7, question: "What is a value statement?", answer: "A declaration of an organization's core principles and ethical standards." },
  { deckId: 7, question: "What is team collaboration?", answer: "Working together towards a common goal." },
  { deckId: 7, question: "What is constructive feedback?", answer: "Feedback that is specific, actionable, and intended to help improve performance." },
  { deckId: 7, question: "What is adaptability?", answer: "The ability to adjust to new conditions and challenges." },
  { deckId: 7, question: "What is resilience?", answer: "The capacity to recover quickly from difficulties." },
  { deckId: 7, question: "What is accountability?", answer: "Taking responsibility for one's actions and outcomes." },
  { deckId: 7, question: "What is transparency?", answer: "Openness in communication and operations." },
  { deckId: 7, question: "What is a flat organizational structure?", answer: "An organization with few or no levels of middle management." },
  { deckId: 7, question: "What is a hierarchical structure?", answer: "An organization with multiple levels of management." },
  { deckId: 7, question: "What is empowerment?", answer: "Giving employees the authority and confidence to make decisions." },
  { deckId: 7, question: "What is employee engagement?", answer: "The emotional commitment an employee has to the organization." },
  { deckId: 7, question: "What is a growth mindset?", answer: "Belief that abilities can be developed through dedication and hard work." },
  { deckId: 7, question: "What is psychological safety?", answer: "A belief that one can speak up without risk of punishment or humiliation." },
  { deckId: 7, question: "What is mentorship?", answer: "Guidance provided by a more experienced person to a less experienced one." },
  { deckId: 7, question: "What is onboarding?", answer: "The process of integrating a new employee into an organization." },
  { deckId: 7, question: "What is offboarding?", answer: "The process of managing an employee's exit from an organization." },
  { deckId: 7, question: "What is a code of conduct?", answer: "A set of rules outlining the responsibilities of individuals in an organization." },
  { deckId: 7, question: "What is conflict resolution?", answer: "Methods and processes involved in facilitating the peaceful ending of conflict." },
  { deckId: 7, question: "What is employee advocacy?", answer: "Employees promoting their organization externally." },
  { deckId: 7, question: "What is a performance review?", answer: "A regular assessment of an employee's job performance." },
  { deckId: 7, question: "What is a flexible work arrangement?", answer: "Alternative schedules or locations for work, such as remote work or flextime." },
  { deckId: 7, question: "What is a team-building activity?", answer: "Exercises designed to improve team performance and cohesion." },
  { deckId: 7, question: "What is an open-door policy?", answer: "A policy encouraging open communication between employees and management." },
  { deckId: 7, question: "What is succession planning?", answer: "A strategy for passing on leadership roles within a company." },
  { deckId: 7, question: "What is a feedback culture?", answer: "A workplace where feedback is regularly given and received." },
  { deckId: 7, question: "What is corporate social responsibility?", answer: "A company's commitment to manage its social, environmental, and economic effects responsibly." },
  { deckId: 7, question: "What is a whistleblower?", answer: "Someone who exposes wrongdoing within an organization." },
  { deckId: 7, question: "What is employee recognition?", answer: "Acknowledging and rewarding employees' contributions." },
  { deckId: 7, question: "What is a team charter?", answer: "A document that defines the team's purpose, objectives, and rules." },
  { deckId: 7, question: "What is remote work?", answer: "Working from a location other than the central office." },
  { deckId: 7, question: "What is cross-functional collaboration?", answer: "Teams from different departments working together on a project." },
  { deckId: 7, question: "What is a learning organization?", answer: "An organization that encourages continuous learning and adaptation." }


];
// --- 2. Interview Resources and Learning Platforms ---
const interviewResources = [
  { title: "Top 50 DBMS Interview Questions", url: "https://www.geeksforgeeks.org/top-50-dbms-interview-questions-and-answers/", icon: <Database className="h-4 w-4 mr-2" /> },
  { title: "Top 100 DSA Questions", url: "https://www.geeksforgeeks.org/top-100-data-structure-and-algorithms-dsa-interview-questions-topic-wise/", icon: <Code className="h-4 w-4 mr-2" /> },
  { title: "System Design Interview Prep", url: "https://www.geeksforgeeks.org/system-design-tutorial/", icon: <Brain className="h-4 w-4 mr-2" /> },
  { title: "OOPS Interview Questions", url: "https://www.geeksforgeeks.org/top-50-object-oriented-programming-oop-interview-questions-and-answers/", icon: <BookOpen className="h-4 w-4 mr-2" /> },
];

const learningPlatforms = [
  { name: "LeetCode", url: "https://leetcode.com/", icon: <Code className="h-4 w-4" /> },
  { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/", icon: <BookOpen className="h-4 w-4" /> },
  { name: "InterviewBit", url: "https://www.interviewbit.com/", icon: <Award className="h-4 w-4" /> },
  { name: "DataCamp", url: "https://www.datacamp.com/", icon: <Database className="h-4 w-4" /> },
  { name: "Coursera", url: "https://www.coursera.org/", icon: <BookOpen className="h-4 w-4" /> },
];

// --- 3. Animated Stopwatch Component ---
const AnimatedStopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (t: number) => {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
      <motion.div
          className="flex flex-col items-center p-3 bg-secondary rounded-lg shadow-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
      >
        <motion.div
            className="flex items-center justify-center mb-2"
            animate={{ rotate: isRunning ? 360 : 0 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="h-6 w-6 text-primary" />
        </motion.div>
        <div className="text-xl font-mono font-bold mb-2">{formatTime(time)}</div>
        <div className="flex gap-2">
          <Button
              size="sm"
              variant={isRunning ? "outline" : "default"}
              onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
              size="sm"
              variant="outline"
              onClick={() => setTime(0)}
          >
            Reset
          </Button>
        </div>
      </motion.div>
  );
};

// --- 4. Main Learning Page ---
export default function LearningPage() {
  const [selectedDeckId, setSelectedDeckId] = useState<number>(decks[0].id);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Get current deck and its cards
  const currentDeck = decks.find(deck => deck.id === selectedDeckId);
  const cards = allCards.filter(card => card.deckId === selectedDeckId);

  // Handlers
  const handleDeckChange = (deckId: number) => {
    setSelectedDeckId(deckId);
    setCurrentCardIndex(0);
  };
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) setCurrentCardIndex(currentCardIndex + 1);
  };
  const handlePrevCard = () => {
    if (currentCardIndex > 0) setCurrentCardIndex(currentCardIndex - 1);
  };

  return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <SidebarNav />
        <div className="flex-1">
          <MobileNav />
          <main className="container mx-auto p-4 md:p-6 lg:p-8">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <motion.h1
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
              >
                Learning
              </motion.h1>
              <motion.p
                  className="text-muted-foreground mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
              >
                Review flashcards for core subjects to strengthen your knowledge.
              </motion.p>
            </motion.div>

            {/* Deck Selector & Stopwatch */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <motion.div
                  className="mb-4 md:mb-0 flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex space-x-2 p-1">
                  {decks.map((deck, index) => (
                      <motion.div
                          key={deck.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                      >
                        <Button
                            variant={selectedDeckId === deck.id ? "default" : "outline"}
                            className={`px-4 py-2 ${selectedDeckId === deck.id ? 'shadow-md' : ''}`}
                            onClick={() => handleDeckChange(deck.id)}
                        >
                          {deck.subject}
                        </Button>
                      </motion.div>
                  ))}
                </div>
              </motion.div>
              <div className="md:ml-4">
                <AnimatedStopwatch />
              </div>
            </div>

            {/* Flashcard Section */}
            <div className="mb-8">
              {cards.length > 0 ? (
                  <AnimatePresence mode="wait" key={currentCardIndex}>
                    <motion.div
                        key={selectedDeckId + "-" + currentCardIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-secondary border-accent/20">
                        <CardHeader>
                          <CardTitle className="text-center text-2xl">{currentDeck?.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-8">
                          <Flashcard
                              question={cards[currentCardIndex].question}
                              answer={cards[currentCardIndex].answer}
                              onNext={handleNextCard}
                              onPrev={handlePrevCard}
                              canGoNext={currentCardIndex < cards.length - 1}
                              canGoPrev={currentCardIndex > 0}
                              currentIndex={currentCardIndex}
                              totalCards={cards.length}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-center">
                          <div className="text-sm text-muted-foreground">
                            Click on the card to flip it or use the controls below
                          </div>
                        </CardFooter>
                      </Card>
                      {/* Mobile Card Navigation */}
                      <div className="mt-4 flex justify-between items-center md:hidden">
                        <Button
                            variant="outline"
                            onClick={handlePrevCard}
                            disabled={currentCardIndex === 0}
                            className="flex items-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous
                        </Button>
                        <span className="text-sm">
                      {currentCardIndex + 1} / {cards.length}
                    </span>
                        <Button
                            variant="outline"
                            onClick={handleNextCard}
                            disabled={currentCardIndex === cards.length - 1}
                            className="flex items-center gap-1"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
              ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <h2 className="text-xl font-semibold mb-2">No Flashcards Available</h2>
                      <p className="text-muted-foreground text-center">
                        This deck doesn't have any flashcards yet.
                      </p>
                    </CardContent>
                  </Card>
              )}
            </div>

            {/* Interview Resources */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4">Interview Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewResources.map((resource, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    >
                      <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline"
                      >
                        <Card className="hover:border-primary/50 hover:shadow-md transition-all">
                          <CardContent className="flex items-center p-4">
                            <motion.div
                                initial={{ rotate: 0 }}
                                whileHover={{ rotate: 15, scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 200 }}
                            >
                              {resource.icon}
                            </motion.div>
                            <span className="flex-1 ml-2">{resource.title}</span>
                            <motion.div
                                whileHover={{ x: 3 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                              <ExternalLink className="h-4 w-4 ml-2 text-muted-foreground" />
                            </motion.div>
                          </CardContent>
                        </Card>
                      </a>
                    </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Learning Platforms */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-4">Learning Platforms</h2>
              <div className="flex flex-wrap gap-4">
                {learningPlatforms.map((platform, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                      <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="no-underline"
                      >
                        <Button variant="outline" className="flex items-center gap-2 shadow-sm hover:shadow transition-all">
                          <motion.div
                              animate={{ rotate: [0, 10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                          >
                            {platform.icon}
                          </motion.div>
                          {platform.name}
                          <motion.div
                              whileHover={{ x: 3 }}
                              transition={{ type: "spring", stiffness: 400 }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </motion.div>
                        </Button>
                      </a>
                    </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Study Tips (Tabs) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
                className="mb-8"
            >
              <Card className="bg-accent/5 border-accent/20 overflow-hidden">
                <CardHeader>
                  <motion.div
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <CardTitle>Study Tips</CardTitle>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active-recall">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="active-recall">Active Recall</TabsTrigger>
                      <TabsTrigger value="spaced-repetition">Spaced Repetition</TabsTrigger>
                      <TabsTrigger value="note-taking">Note-Taking</TabsTrigger>
                      <TabsTrigger value="collaborative">Collaborative Study</TabsTrigger>

                    </TabsList>
                    <AnimatePresence mode="wait">
                      {/* Active Recall Tab */}
                      <TabsContent value="active-recall" className="mt-4">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                          <p>
                            <strong>Active recall</strong> is one of the most effective study techniques. It involves
                            actively stimulating your memory during learning, rather than passively reading notes[3][5].
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            {[
                              "Try to answer the question before flipping the card",
                              "Explain concepts aloud as if teaching someone else (production effect)",
                              "Create voice memos of your explanations",
                              "Write down your answer before checking",
                              "Use the Feynman Technique to simplify complex topics",
                              "Create your own questions from study material",
                              "Do closed-book summaries after reading"
                            ].map((tip, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                  {tip}
                                </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </TabsContent>

                      {/* New Note-Taking Tab */}
                      <TabsContent value="note-taking" className="mt-4">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                          <p>
                            <strong>Effective note-taking</strong> enhances retention and organization of information.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            {[
                              "Cornell Method: Divide pages into notes, cues, and summary sections",
                              "Charting Method: Create tables for comparing concepts",
                              "Sentence Method: Write concise key points during fast-paced sessions",
                              "Mind Mapping: Visualize connections between concepts",
                              "Annotate diagrams with your own explanations",
                              "Use different colors for different types of information"
                            ].map((tip, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                  {tip}
                                </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </TabsContent>

                      {/* New Collaborative Learning Tab */}
                      <TabsContent value="collaborative" className="mt-4">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                          <p>
                            <strong>Collaborative learning</strong> enhances understanding through group interaction.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            {[
                              "Form study groups to explain concepts to peers",
                              "Use pair programming for technical subjects",
                              "Create shared accountability with study partners",
                              "Teach concepts to friends/family members",
                              "Record and compare explanations with peers",
                              "Use whiteboard sessions for problem solving"
                            ].map((tip, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                  {tip}
                                </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="spaced-repetition" className="mt-4">
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                          <p>
                            <strong>Spaced repetition</strong> is a technique where you review material at
                            increasing intervals over time, which helps move information into long-term memory.
                          </p>
                          <ul className="list-disc pl-5 space-y-2">
                            {[
                              "Review new concepts within 24 hours of first learning them",
                              "Review again after 3 days, then 1 week, then 2 weeks",
                              "Focus more time on difficult concepts",
                              "Short, frequent study sessions are better than cramming"
                            ].map((tip, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                >
                                  {tip}
                                </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </TabsContent>
                    </AnimatePresence>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
  );
}