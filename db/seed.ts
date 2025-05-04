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
        { name: "Computer Science Core", subject: "CS" },
        { name: "Data Structures & Algorithms", subject: "DSA" },
        { name: "SQL & Databases", subject: "SQL" },
        { name: "Operating Systems", subject: "OS" },
        { name: "HR & Behavioral", subject: "HR" },
        { name: "Body Language & Soft Skills", subject: "BodyLanguage" },
        { name: "Cultural Fit", subject: "CulturalFit" }
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
    case "CS":
      return [
        { question: "What is a class in OOP?", answer: "A blueprint for creating objects, defining their properties and behaviors." },
        { question: "What is a superclass?", answer: "A class from which other classes inherit properties and methods." },
        { question: "What is a compiler?", answer: "A program that translates source code into machine code." },
        { question: "What is an interpreter?", answer: "A program that executes code line by line." },
        { question: "What is the difference between primary and secondary memory?", answer: "Primary memory is volatile and fast (RAM); secondary memory is non-volatile and used for long-term storage (HDD/SSD)." },
        { question: "What is object-oriented programming?", answer: "A paradigm based on objects and classes to structure software." },
        { question: "What is encapsulation?", answer: "The bundling of data and methods that operate on the data within one unit, like a class." },
        { question: "What is inheritance?", answer: "A mechanism where one class acquires properties of another class." },
        { question: "What is polymorphism?", answer: "The ability of different objects to respond to the same function call in different ways." },
        { question: "What is abstraction?", answer: "Hiding complex implementation details and showing only the necessary features." },
        { question: "What is a variable?", answer: "A named storage location for data." },
        { question: "What is a function?", answer: "A block of code that performs a specific task." },
        { question: "What is recursion?", answer: "A function calling itself to solve a problem." },
        { question: "What is a loop?", answer: "A control structure to repeat a block of code multiple times." },
        { question: "What is a conditional statement?", answer: "A statement that executes code based on a condition (e.g., if-else)." },
        { question: "What is an array?", answer: "A collection of elements stored in contiguous memory locations." },
        { question: "What is a pointer?", answer: "A variable that stores the address of another variable." },
        { question: "What is a stack overflow?", answer: "An error caused by excessive use of stack memory, often due to infinite recursion." },
        { question: "What is a memory leak?", answer: "Failure to release unused memory, causing reduced available memory." },
        { question: "What is a framework?", answer: "A reusable set of libraries or tools for software development." },
        { question: "What is an API?", answer: "A set of functions and protocols for building software." },
        { question: "What is a library?", answer: "A collection of precompiled routines for use in programs." },
        { question: "What is software testing?", answer: "The process of evaluating software for correctness and quality." },
        { question: "What is debugging?", answer: "Finding and fixing errors in code." },
        { question: "What is version control?", answer: "A system for tracking changes to code over time." },
        { question: "What is Git?", answer: "A distributed version control system." },
        { question: "What is a repository?", answer: "A storage location for code and its history." },
        { question: "What is branching in Git?", answer: "Creating independent lines of development in a repository." },
        { question: "What is merging in Git?", answer: "Combining changes from different branches." },
        { question: "What is continuous integration?", answer: "Automatically building and testing code after changes are made." },
        { question: "What is Agile methodology?", answer: "An iterative approach to software development focused on collaboration and flexibility." },
        { question: "What is SDLC?", answer: "Software Development Life Cycle-a process for software creation." },
        { question: "What is UML?", answer: "Unified Modeling Language for visualizing software design." },
        { question: "What is a flowchart?", answer: "A diagram representing the flow of a program or process." },
        { question: "What is exception handling?", answer: "Managing errors during program execution." },
        { question: "What is a database?", answer: "An organized collection of structured data." },
        { question: "What is normalization?", answer: "Organizing data to reduce redundancy and improve integrity." },
        { question: "What is a transaction?", answer: "A sequence of database operations treated as a single unit." },
        { question: "What is cloud computing?", answer: "Delivering computing services over the internet." },
        { question: "What is API rate limiting?", answer: "Restricting the number of API requests a user can make in a time period." },
        { question: "What is garbage collection?", answer: "Automatic memory management that reclaims unused memory." }
      ]
          .slice(0, 40);

    case "DSA":
      return [
        { question: "What is a data structure?", answer: "A way to organize and store data for efficient access and modification." },
        { question: "What is an algorithm?", answer: "A step-by-step procedure to solve a problem." },
        { question: "What is an array?", answer: "A collection of elements identified by index." },
        { question: "What is a linked list?", answer: "A sequence of nodes, each pointing to the next." },
        { question: "What is a stack?", answer: "A Last-In, First-Out (LIFO) data structure." },
        { question: "What is a queue?", answer: "A First-In, First-Out (FIFO) data structure." },
        { question: "What is a tree?", answer: "A hierarchical data structure with nodes and edges." },
        { question: "What is a binary tree?", answer: "A tree where each node has at most two children." },
        { question: "What is a binary search tree?", answer: "A binary tree where left child < parent < right child." },
        { question: "What is a heap?", answer: "A complete binary tree used for priority queues." },
        { question: "What is a graph?", answer: "A set of nodes connected by edges." },
        { question: "What is a hash table?", answer: "A structure that maps keys to values for fast lookup." },
        { question: "What is a doubly linked list?", answer: "A linked list where nodes have pointers to both next and previous nodes." },
        { question: "What is a circular queue?", answer: "A queue where the last element connects to the first." },
        { question: "What is time complexity?", answer: "A measure of algorithm's running time as input size grows." },
        { question: "What is space complexity?", answer: "A measure of memory used by an algorithm." },
        { question: "What is Big O notation?", answer: "A notation to describe upper bound of algorithm's complexity." },
        { question: "What is linear search?", answer: "Searching an element by checking each item in sequence." },
        { question: "What is binary search?", answer: "Searching a sorted array by repeatedly dividing search interval in half." },
        { question: "What is bubble sort?", answer: "A sorting algorithm that repeatedly swaps adjacent elements if out of order." },
        { question: "What is selection sort?", answer: "A sorting algorithm that selects the minimum element and moves it to the beginning." },
        { question: "What is insertion sort?", answer: "A sorting algorithm that builds the sorted array one item at a time." },
        { question: "What is merge sort?", answer: "A divide-and-conquer sorting algorithm." },
        { question: "What is quick sort?", answer: "A divide-and-conquer sorting algorithm using a pivot." },
        { question: "What is a balanced tree?", answer: "A tree where the height difference between left and right subtrees is minimal." },
        { question: "What is a trie?", answer: "A tree-like data structure for storing strings." },
        { question: "What is a priority queue?", answer: "A queue where elements are served based on priority." },
        { question: "What is BFS?", answer: "Breadth-First Search-visits nodes level by level." },
        { question: "What is DFS?", answer: "Depth-First Search-visits nodes by exploring as far as possible." },
        { question: "What is a spanning tree?", answer: "A subgraph that connects all nodes without cycles." },
        { question: "What is Dijkstra’s algorithm?", answer: "An algorithm for finding shortest paths in a graph." },
        { question: "What is dynamic programming?", answer: "A technique for solving problems by breaking them into subproblems and storing results." },
        { question: "What is memoization?", answer: "Storing results of expensive function calls for reuse." },
        { question: "What is a greedy algorithm?", answer: "An algorithm that makes the locally optimal choice at each step." },
        { question: "What is a hash collision?", answer: "When two keys map to the same index in a hash table." },
        { question: "What is amortized analysis?", answer: "Average time per operation over a sequence of operations." },
        { question: "What is a postfix expression?", answer: "An expression where operators follow operands." },
        { question: "What is a graph cycle?", answer: "A path that starts and ends at the same node." },
        { question: "What is backtracking?", answer: "A recursive algorithmic technique to solve problems by exploring all possibilities." },
        { question: "What is a minimum spanning tree?", answer: "A spanning tree with the smallest possible total edge weight." },
        { question: "What is the difference between BFS and DFS?", answer: "BFS uses a queue and explores level by level; DFS uses a stack and explores depth-wise." }
      ]
          .slice(0, 40);

    case "SQL":
      return [
        { question: "What is SQL?", answer: "Structured Query Language, used to manage and query relational databases." },
        { question: "What are the types of SQL commands?", answer: "DDL, DML, DCL, TCL." },
        { question: "What is a primary key?", answer: "A field that uniquely identifies each record in a table." },
        { question: "What is a foreign key?", answer: "A field in one table that refers to the primary key in another table." },
        { question: "What is normalization?", answer: "Organizing data to reduce redundancy and improve integrity." },
        { question: "What is denormalization?", answer: "Combining tables to improve read performance at the cost of redundancy." },
        { question: "What is a JOIN in SQL?", answer: "Combining rows from two or more tables based on a related column." },
        { question: "Name types of JOINs.", answer: "INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN." },
        { question: "What is the difference between WHERE and HAVING?", answer: "WHERE filters rows before grouping; HAVING filters after grouping." },
        { question: "What is an index?", answer: "A database object to speed up data retrieval." },
        { question: "What is a view?", answer: "A virtual table based on the result-set of an SQL statement." },
        { question: "What is a stored procedure?", answer: "A precompiled collection of SQL statements stored in the database." },
        { question: "What is a trigger?", answer: "A set of instructions that executes automatically in response to certain events on a table." },
        { question: "What is a transaction?", answer: "A sequence of operations performed as a single logical unit of work." },
        { question: "Explain ACID properties.", answer: "Atomicity, Consistency, Isolation, Durability-properties ensuring reliable transactions." },
        { question: "What is a composite key?", answer: "A key made of two or more columns to uniquely identify a row." },
        { question: "What is a unique key?", answer: "A constraint that ensures all values in a column are unique." },
        { question: "Difference between UNION and UNION ALL?", answer: "UNION removes duplicates; UNION ALL includes all records." },
        { question: "What is a subquery?", answer: "A query nested inside another query." },
        { question: "What is a correlated subquery?", answer: "A subquery that references columns from the outer query." },
        { question: "What is a NULL value?", answer: "Represents missing or unknown data in a table." },
        { question: "What is the LIKE operator used for?", answer: "Pattern matching in WHERE clauses." },
        { question: "What is the IN operator?", answer: "Specifies multiple values in a WHERE clause." },
        { question: "What is a constraint?", answer: "A rule enforced on data columns (e.g., NOT NULL, UNIQUE, CHECK, FOREIGN KEY)." },
        { question: "What is a scalar function?", answer: "A function that returns a single value based on input." },
        { question: "What is an aggregate function?", answer: "A function that performs calculations on multiple values (SUM, AVG, COUNT, etc.)." },
        { question: "What is GROUP BY used for?", answer: "To group rows that have the same values in specified columns." },
        { question: "What is ORDER BY used for?", answer: "To sort the result-set in ascending or descending order." },
        { question: "What is a database schema?", answer: "The structure that defines tables, fields, and relationships in a database." },
        { question: "What is a data warehouse?", answer: "A system for reporting and data analysis, storing large amounts of data." },
        { question: "What is a window function?", answer: "A function that performs calculations across a set of rows related to the current row." },
        { question: "What is a self join?", answer: "A regular join but the table is joined with itself." },
        { question: "Difference between DELETE and TRUNCATE?", answer: "DELETE removes rows one at a time; TRUNCATE removes all rows quickly." },
        { question: "What is an alias in SQL?", answer: "A temporary name given to a table or column in a query." },
        { question: "What is a clustered index?", answer: "An index that sorts and stores the data rows of the table based on the index key." },
        { question: "What is a non-clustered index?", answer: "A separate structure from the data rows containing pointers to the data." },
        { question: "What is database replication?", answer: "Copying and maintaining database objects in multiple databases." },
        { question: "What is a surrogate key?", answer: "A unique identifier for an entity, not derived from application data." },
        { question: "Difference between SQL and NoSQL?", answer: "SQL is relational, uses structured tables; NoSQL is non-relational, handles unstructured data." }
      ]
          .slice(0, 40);

    case "OS":
      return [
        { question: "What is an operating system?", answer: "Software that manages hardware and software resources of a computer." },
        { question: "What are the main functions of an OS?", answer: "Resource management, user interface, file management, device management, scheduling, security." },
        { question: "What is a kernel?", answer: "The core component of an OS managing system resources." },
        { question: "What is a process?", answer: "A program in execution." },
        { question: "Difference between process and thread?", answer: "A thread is a lightweight process; processes are independent." },
        { question: "What is process scheduling?", answer: "The activity of deciding which process runs at a given time." },
        { question: "What is context switching?", answer: "Saving and loading process states for multitasking." },
        { question: "What is a deadlock?", answer: "A situation where processes wait indefinitely for resources." },
        { question: "Conditions for deadlock?", answer: "Mutual exclusion, hold and wait, no preemption, circular wait." },
        { question: "What is virtual memory?", answer: "A memory management technique that gives the illusion of more RAM." },
        { question: "What is paging?", answer: "Dividing memory into fixed-size pages." },
        { question: "What is segmentation?", answer: "Dividing memory into variable-sized segments." },
        { question: "What is a file system?", answer: "A way of organizing and storing files on storage devices." },
        { question: "What is a device driver?", answer: "Software that controls hardware devices." },
        { question: "What is a system call?", answer: "A request to the OS for a service." },
        { question: "What is a shell?", answer: "A user interface for accessing OS services." },
        { question: "What is a real-time OS (RTOS)?", answer: "An OS used for real-time applications with strict timing constraints." },
        { question: "What is multitasking?", answer: "Running multiple tasks simultaneously." },
        { question: "What is multiprogramming?", answer: "Keeping multiple programs in memory to improve CPU usage." },
        { question: "What is a scheduler?", answer: "Software that selects the next process to run." },
        { question: "What is a dispatcher?", answer: "Transfers control of the CPU to the selected process." },
        { question: "Preemptive vs Non-preemptive scheduling?", answer: "Preemptive can interrupt processes; non-preemptive cannot." },
        { question: "What is a race condition?", answer: "When processes access shared data concurrently, leading to unpredictable results." },
        { question: "What is mutual exclusion?", answer: "Ensuring only one process accesses a resource at a time." },
        { question: "What is inter-process communication (IPC)?", answer: "Mechanisms for processes to communicate." },
        { question: "Types of IPC?", answer: "Pipes, message queues, shared memory, semaphores." },
        { question: "What is a semaphore?", answer: "A synchronization tool for managing resources." },
        { question: "What is a monitor in OS?", answer: "A synchronization construct for threads." },
        { question: "What is thrashing?", answer: "Excessive paging causing low performance." },
        { question: "What is a zombie process?", answer: "A process that has finished execution but still has an entry in the process table." },
        { question: "What is a bootloader?", answer: "Software that loads the OS at startup." },
        { question: "What is demand paging?", answer: "Loading pages into memory only when needed." },
        { question: "What is a microkernel?", answer: "A minimal OS kernel with most services in user space." },
        { question: "What is a monolithic kernel?", answer: "A kernel where all OS services run in kernel space." },
        { question: "What is swapping?", answer: "Moving processes between RAM and disk." },
        { question: "What is a page fault?", answer: "When a program accesses data not in physical memory." },
        { question: "What is Belady's anomaly?", answer: "More frames causing more page faults in some algorithms." },
        { question: "What is RAID?", answer: "Redundant Array of Independent Disks for data redundancy." },
        { question: "What is file fragmentation?", answer: "Non-contiguous storage of file data." },
        { question: "What is device management in OS?", answer: "Managing input/output devices." }
      ]
          .slice(0, 40);

    case "HR":
      return [
        { question: "Tell me about yourself.", answer: "A brief summary of your education, skills, and interests." },
        { question: "Why should we hire you?", answer: "Highlight your strengths and fit for the role." },
        { question: "What are your strengths?", answer: "Mention relevant skills and qualities." },
        { question: "What are your weaknesses?", answer: "Share a real weakness and how you’re improving." },
        { question: "Why do you want to work here?", answer: "Show knowledge of the company and alignment with its values." },
        { question: "Where do you see yourself in five years?", answer: "Describe career goals and growth." },
        { question: "Describe a challenging situation and how you handled it.", answer: "Share a specific example and your actions." },
        { question: "How do you handle criticism?", answer: "Show openness to feedback." },
        { question: "How do you prioritize your work?", answer: "Explain your time management methods." },
        { question: "What motivates you?", answer: "Share what drives you to succeed." },
        { question: "How do you handle stress?", answer: "Describe your coping strategies." },
        { question: "Do you prefer working alone or in a team?", answer: "Express flexibility." },
        { question: "How do you stay updated with industry trends?", answer: "Mention learning methods." },
        { question: "What are your salary expectations?", answer: "Provide a researched range." },
        { question: "Why did you choose this career path?", answer: "Explain your interest." },
        { question: "What do you know about our competitors?", answer: "Show industry awareness." },
        { question: "How do you handle conflict with a coworker?", answer: "Describe communication and resolution." },
        { question: "What is your biggest achievement?", answer: "Share a relevant accomplishment." },
        { question: "Are you willing to relocate?", answer: "State your flexibility." },
        { question: "When can you start?", answer: "Give your availability." },
        { question: "What are your hobbies?", answer: "Mention positive, relevant hobbies." },
        { question: "How did your education prepare you for this job?", answer: "Highlight relevant coursework or projects." },
        { question: "How do you handle deadlines?", answer: "Discuss planning and prioritization." },
        { question: "Would you like to pursue higher studies?", answer: "Share your current focus." },
        { question: "What skills do you want to develop?", answer: "Identify learning goals." },
        { question: "What is your ideal job?", answer: "Describe your preferred role." },
        { question: "How do you deal with failure?", answer: "Show resilience." },
        { question: "What is your leadership style?", answer: "Describe your approach." },
        { question: "How do you ensure a positive work environment?", answer: "Talk about communication and respect." },
        { question: "What are your long-term career goals?", answer: "Share your ambitions." },
        { question: "Do you have any questions for us?", answer: "Prepare thoughtful questions." },
        { question: "What makes you unique?", answer: "Highlight your differentiators." },
        { question: "How do you handle multitasking?", answer: "Explain your strategy." },
        { question: "What is your greatest professional regret?", answer: "Share a learning experience." },
        { question: "How do you handle ambiguity?", answer: "Describe adaptability." },
        { question: "What is your decision-making process?", answer: "Explain your approach." },
        { question: "How do you manage work-life balance?", answer: "Describe your method." },
        { question: "What are your expectations from this job?", answer: "Share your goals." },
        { question: "How do you handle repetitive tasks?", answer: "Show motivation and focus." },
        { question: "How do you celebrate success?", answer: "Describe your approach to achievement." }
      ]
          .slice(0, 40);

    case "BodyLanguage":
      return [
        { question: "Why is good posture important in interviews?", answer: "It shows confidence and professionalism." },
        { question: "How does eye contact affect an interview?", answer: "It signals engagement and honesty." },
        { question: "What does a firm handshake communicate?", answer: "Confidence and enthusiasm." },
        { question: "How do facial expressions impact your performance?", answer: "Positive expressions make you approachable." },
        { question: "Why avoid crossing your arms?", answer: "It can seem defensive." },
        { question: "What does fidgeting indicate?", answer: "Nervousness or distraction." },
        { question: "How can hand gestures be used effectively?", answer: "To emphasize points, but not distract." },
        { question: "Why mirror the interviewer’s body language?", answer: "It builds rapport." },
        { question: "What does leaning forward indicate?", answer: "Interest and engagement." },
        { question: "Why avoid checking your phone or watch?", answer: "It signals impatience or disinterest." },
        { question: "How can your voice convey confidence?", answer: "By speaking clearly and steadily." },
        { question: "What does slouching communicate?", answer: "Lack of confidence or interest." },
        { question: "How to manage nervousness through body language?", answer: "Maintain open posture and controlled gestures." },
        { question: "What does a blank expression convey?", answer: "Unfriendliness or lack of engagement." },
        { question: "Why avoid touching your face?", answer: "It can signal discomfort or dishonesty." },
        { question: "What does leaning back suggest?", answer: "Disengagement." },
        { question: "How can you use pauses effectively?", answer: "To show thoughtfulness." },
        { question: "Why avoid defensive or aggressive posture?", answer: "It can seem combative." },
        { question: "What is the impact of smiling?", answer: "It makes you appear positive." },
        { question: "How should you sit in relation to the interviewer?", answer: "At a slight angle, not directly facing." },
        { question: "What does mirroring tone and pace suggest?", answer: "Adaptability." },
        { question: "How to show attentiveness?", answer: "Nodding and leaning in." },
        { question: "Why avoid wild hand movements?", answer: "They are distracting." },
        { question: "How to project openness?", answer: "Keep arms open and relaxed." },
        { question: "Why avoid shrugging?", answer: "It shows uncertainty." },
        { question: "What does stiffness in posture indicate?", answer: "Nervousness." },
        { question: "How to use gestures to enhance answers?", answer: "Use sparingly for emphasis." },
        { question: "Why maintain a calm demeanor?", answer: "It projects confidence." },
        { question: "How does body alignment affect rapport?", answer: "It creates harmony." },
        { question: "What is the effect of being visibly bored?", answer: "It signals lack of interest." },
        { question: "Why keep your hands visible?", answer: "It builds trust." },
        { question: "What does nodding indicate?", answer: "Understanding and agreement." },
        { question: "Why avoid looking around the room?", answer: "It shows distraction." },
        { question: "How to show you’re listening?", answer: "Maintain eye contact and nod." },
        { question: "Why avoid tapping fingers?", answer: "It signals impatience." },
        { question: "What does a relaxed smile communicate?", answer: "Friendliness." },
        { question: "Why avoid sitting on the edge of your seat?", answer: "It shows anxiety." },
        { question: "How to use breathing to manage nerves?", answer: "Deep breathing calms you." },
        { question: "Why avoid playing with objects?", answer: "It distracts the interviewer." },
        { question: "How to exit the interview confidently?", answer: "Stand, smile, and thank the interviewer." }
      ]
          .slice(0, 40);

    case "CulturalFit":
      return [
        { question: "What is a 360-degree feedback?", answer: "A method of performance appraisal where feedback is gathered from all around an employee." },
        { question: "What is employee retention?", answer: "An organization's ability to keep its employees and reduce turnover." },
        { question: "What is work-life balance?", answer: "A concept including proper prioritization between work (career and ambition) and lifestyle (health, pleasure, leisure, family)." },
        { question: "What is company culture?", answer: "The shared values, beliefs, and behaviors within an organization." },
        { question: "What is diversity in the workplace?", answer: "Inclusion of people from different backgrounds, cultures, and perspectives." },
        { question: "What is inclusion?", answer: "Ensuring all individuals feel valued and integrated into the workplace." },
        { question: "What is a mission statement?", answer: "A formal summary of the aims and values of a company." },
        { question: "What is a vision statement?", answer: "A company's long-term goals and aspirations." },
        { question: "What is a value statement?", answer: "A declaration of an organization's core principles and ethical standards." },
        { question: "What is team collaboration?", answer: "Working together towards a common goal." },
        { question: "What is constructive feedback?", answer: "Feedback that is specific, actionable, and intended to help improve performance." },
        { question: "What is adaptability?", answer: "The ability to adjust to new conditions and challenges." },
        { question: "What is resilience?", answer: "The capacity to recover quickly from difficulties." },
        { question: "What is accountability?", answer: "Taking responsibility for one's actions and outcomes." },
        { question: "What is transparency?", answer: "Openness in communication and operations." },
        { question: "What is a flat organizational structure?", answer: "An organization with few or no levels of middle management." },
        { question: "What is a hierarchical structure?", answer: "An organization with multiple levels of management." },
        { question: "What is empowerment?", answer: "Giving employees the authority and confidence to make decisions." },
        { question: "What is employee engagement?", answer: "The emotional commitment an employee has to the organization." },
        { question: "What is a growth mindset?", answer: "Belief that abilities can be developed through dedication and hard work." },
        { question: "What is psychological safety?", answer: "A belief that one can speak up without risk of punishment or humiliation." },
        { question: "What is mentorship?", answer: "Guidance provided by a more experienced person to a less experienced one." },
        { question: "What is onboarding?", answer: "The process of integrating a new employee into an organization." },
        { question: "What is offboarding?", answer: "The process of managing an employee's exit from an organization." },
        { question: "What is a code of conduct?", answer: "A set of rules outlining the responsibilities of individuals in an organization." },
        { question: "What is conflict resolution?", answer: "Methods and processes involved in facilitating the peaceful ending of conflict." },
        { question: "What is employee advocacy?", answer: "Employees promoting their organization externally." },
        { question: "What is a performance review?", answer: "A regular assessment of an employee's job performance." },
        { question: "What is a flexible work arrangement?", answer: "Alternative schedules or locations for work, such as remote work or flextime." },
        { question: "What is a team-building activity?", answer: "Exercises designed to improve team performance and cohesion." },
        { question: "What is an open-door policy?", answer: "A policy encouraging open communication between employees and management." },
        { question: "What is succession planning?", answer: "A strategy for passing on leadership roles within a company." },
        { question: "What is a feedback culture?", answer: "A workplace where feedback is regularly given and received." },
        { question: "What is corporate social responsibility?", answer: "A company's commitment to manage its social, environmental, and economic effects responsibly." },
        { question: "What is a whistleblower?", answer: "Someone who exposes wrongdoing within an organization." },
        { question: "What is employee recognition?", answer: "Acknowledging and rewarding employees' contributions." },
        { question: "What is a team charter?", answer: "A document that defines the team's purpose, objectives, and rules." },
        { question: "What is remote work?", answer: "Working from a location other than the central office." },
        { question: "What is cross-functional collaboration?", answer: "Teams from different departments working together on a project." },
        { question: "What is a learning organization?", answer: "An organization that encourages continuous learning and adaptation." }
      ].slice(0, 40);

    default:
      return [];
  }
}

seed();
