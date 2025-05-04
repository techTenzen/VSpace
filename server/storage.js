"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
var _db_1 = require("@db");
var schema_1 = require("@shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
var express_session_1 = require("express-session");
var connect_pg_simple_1 = require("connect-pg-simple");
var _db_2 = require("@db");
// Create PostgreSQL session store
var PostgresSessionStore = (0, connect_pg_simple_1.default)(express_session_1.default);
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
        this.sessionStore = new PostgresSessionStore({
            pool: _db_2.pool,
            createTableIfMissing: true,
            tableName: 'user_sessions'
        });
    }
    // User methods
    DatabaseStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.insert(schema_1.users).values(userData).returning({
                            id: schema_1.users.id,
                            email: schema_1.users.email,
                            fullName: schema_1.users.fullName,
                            department: schema_1.users.department,
                            joiningYear: schema_1.users.joiningYear,
                            rollNumber: schema_1.users.rollNumber,
                            gender: schema_1.users.gender,
                            phoneNumber: schema_1.users.phoneNumber,
                            isOnboardingComplete: schema_1.users.isOnboardingComplete,
                            createdAt: schema_1.users.createdAt,
                        })];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.users.findFirst({
                            where: (0, drizzle_orm_1.eq)(schema_1.users.id, id),
                            columns: {
                                password: false,
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.users.findFirst({
                            where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUserProfile = function (userId, profileData) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.update(schema_1.users)
                            .set(__assign(__assign({}, profileData), { updatedAt: new Date() }))
                            .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
                            .returning({
                            id: schema_1.users.id,
                            email: schema_1.users.email,
                            fullName: schema_1.users.fullName,
                            department: schema_1.users.department,
                            joiningYear: schema_1.users.joiningYear,
                            rollNumber: schema_1.users.rollNumber,
                            gender: schema_1.users.gender,
                            phoneNumber: schema_1.users.phoneNumber,
                            isOnboardingComplete: schema_1.users.isOnboardingComplete,
                        })];
                    case 1:
                        updatedUser = (_a.sent())[0];
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    DatabaseStorage.prototype.completeOnboarding = function (userId, onboardingData) {
        return __awaiter(this, void 0, void 0, function () {
            var fullName, department, joiningYear, rollNumber, gender, phoneNumber, userSkills, updatedUser, skillsToInsert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullName = onboardingData.fullName, department = onboardingData.department, joiningYear = onboardingData.joiningYear, rollNumber = onboardingData.rollNumber, gender = onboardingData.gender, phoneNumber = onboardingData.phoneNumber, userSkills = onboardingData.skills;
                        return [4 /*yield*/, _db_1.db.update(schema_1.users)
                                .set({
                                fullName: fullName,
                                department: department,
                                joiningYear: joiningYear,
                                rollNumber: rollNumber,
                                gender: gender,
                                phoneNumber: phoneNumber,
                                isOnboardingComplete: true,
                                updatedAt: new Date()
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
                                .returning({
                                id: schema_1.users.id,
                                email: schema_1.users.email,
                                fullName: schema_1.users.fullName,
                                department: schema_1.users.department,
                                joiningYear: schema_1.users.joiningYear,
                                rollNumber: schema_1.users.rollNumber,
                                gender: schema_1.users.gender,
                                phoneNumber: schema_1.users.phoneNumber,
                                isOnboardingComplete: schema_1.users.isOnboardingComplete,
                            })];
                    case 1:
                        updatedUser = (_a.sent())[0];
                        if (!(userSkills && userSkills.length > 0)) return [3 /*break*/, 4];
                        skillsToInsert = userSkills.map(function (skill) { return ({
                            userId: userId,
                            name: skill.name,
                            category: skill.category,
                            proficiency: skill.proficiency,
                            notes: skill.notes || '',
                        }); });
                        return [4 /*yield*/, _db_1.db.insert(schema_1.skills).values(skillsToInsert)];
                    case 2:
                        _a.sent();
                        // Record activity
                        return [4 /*yield*/, this.recordActivity(userId, 'skill', "Added ".concat(skillsToInsert.length, " skills during onboarding"))];
                    case 3:
                        // Record activity
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    // Skills methods
    DatabaseStorage.prototype.createSkill = function (userId, skillData) {
        return __awaiter(this, void 0, void 0, function () {
            var newSkill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.insert(schema_1.skills)
                            .values(__assign({ userId: userId }, skillData))
                            .returning()];
                    case 1:
                        newSkill = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(userId, 'skill', "Added new skill: ".concat(skillData.name))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newSkill];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserSkills = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userSkills, filteredSkills;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getUserSkills called with userId:", userId);
                        if (!userId) {
                            console.error("getUserSkills called with invalid userId:", userId);
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, _db_1.db.query.skills.findMany({
                                where: (0, drizzle_orm_1.eq)(schema_1.skills.userId, userId),
                                orderBy: [(0, drizzle_orm_1.desc)(schema_1.skills.updatedAt)],
                            })];
                    case 1:
                        userSkills = _a.sent();
                        console.log("Found", userSkills.length, "skills for user");
                        filteredSkills = userSkills.filter(function (s) { return s.userId === userId; });
                        if (filteredSkills.length !== userSkills.length) {
                            console.error("Data isolation issue detected - some skills didn't match user ID!");
                        }
                        return [2 /*return*/, filteredSkills];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateSkill = function (skillId, userId, skillData) {
        return __awaiter(this, void 0, void 0, function () {
            var skill, updatedSkill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.skills).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.skills.id, skillId), (0, drizzle_orm_1.eq)(schema_1.skills.userId, userId)))];
                    case 1:
                        skill = (_a.sent())[0];
                        if (!skill) {
                            throw new Error('Skill not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.update(schema_1.skills)
                                .set(__assign(__assign({}, skillData), { updatedAt: new Date() }))
                                .where((0, drizzle_orm_1.eq)(schema_1.skills.id, skillId))
                                .returning()];
                    case 2:
                        updatedSkill = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(userId, 'skill', "Updated skill: ".concat(updatedSkill.name))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updatedSkill];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteSkill = function (skillId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var skill;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.skills).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.skills.id, skillId), (0, drizzle_orm_1.eq)(schema_1.skills.userId, userId)))];
                    case 1:
                        skill = (_a.sent())[0];
                        if (!skill) {
                            throw new Error('Skill not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.delete(schema_1.skills).where((0, drizzle_orm_1.eq)(schema_1.skills.id, skillId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.recordActivity(userId, 'skill', "Deleted skill: ".concat(skill.name))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Subjects/Attendance methods
    DatabaseStorage.prototype.createSubject = function (userId, subjectData) {
        return __awaiter(this, void 0, void 0, function () {
            var newSubject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.insert(schema_1.subjects)
                            .values(__assign({ userId: userId }, subjectData))
                            .returning()];
                    case 1:
                        newSubject = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(userId, 'attendance', "Added new subject: ".concat(subjectData.name))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newSubject];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserSubjects = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userSubjects, filteredSubjects;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getUserSubjects called with userId:", userId);
                        if (!userId) {
                            console.error("getUserSubjects called with invalid userId:", userId);
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, _db_1.db.query.subjects.findMany({
                                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subjects.userId, userId), (0, drizzle_orm_1.eq)(schema_1.subjects.isArchived, false)),
                                orderBy: [(0, drizzle_orm_1.desc)(schema_1.subjects.updatedAt)],
                            })];
                    case 1:
                        userSubjects = _a.sent();
                        console.log("Query result:", userSubjects.map(function (s) { return ({ id: s.id, name: s.name, userId: s.userId }); }));
                        filteredSubjects = userSubjects.filter(function (s) { return s.userId === userId; });
                        if (filteredSubjects.length !== userSubjects.length) {
                            console.error("Data isolation issue detected - some subjects didn't match user ID!");
                        }
                        return [2 /*return*/, filteredSubjects];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateSubject = function (subjectId, userId, subjectData) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, updatedSubject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.subjects).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId), (0, drizzle_orm_1.eq)(schema_1.subjects.userId, userId)))];
                    case 1:
                        subject = (_a.sent())[0];
                        if (!subject) {
                            throw new Error('Subject not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.update(schema_1.subjects)
                                .set(__assign(__assign({}, subjectData), { updatedAt: new Date() }))
                                .where((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId))
                                .returning()];
                    case 2:
                        updatedSubject = (_a.sent())[0];
                        return [2 /*return*/, updatedSubject];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateSubjectAttendance = function (subjectId, userId, attended) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, updatedAttended, updatedTotal, updatedSubject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.subjects).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId), (0, drizzle_orm_1.eq)(schema_1.subjects.userId, userId)))];
                    case 1:
                        subject = (_a.sent())[0];
                        if (!subject) {
                            throw new Error('Subject not found or not owned by user');
                        }
                        updatedAttended = attended ? subject.attendedClasses + 1 : subject.attendedClasses;
                        updatedTotal = subject.totalClasses + 1;
                        return [4 /*yield*/, _db_1.db.update(schema_1.subjects)
                                .set({
                                attendedClasses: updatedAttended,
                                totalClasses: updatedTotal,
                                updatedAt: new Date()
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId))
                                .returning()];
                    case 2:
                        updatedSubject = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(userId, 'attendance', "Marked ".concat(attended ? 'present' : 'absent', " for ").concat(subject.name), JSON.stringify({ attended: attended, current: "".concat(updatedAttended, "/").concat(updatedTotal) }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updatedSubject];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteSubject = function (subjectId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var subject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.subjects).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId), (0, drizzle_orm_1.eq)(schema_1.subjects.userId, userId)))];
                    case 1:
                        subject = (_a.sent())[0];
                        if (!subject) {
                            throw new Error('Subject not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.delete(schema_1.subjects).where((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.recordActivity(userId, 'attendance', "Deleted subject: ".concat(subject.name))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.archiveSubject = function (subjectId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, updatedSubject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.subjects).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId), (0, drizzle_orm_1.eq)(schema_1.subjects.userId, userId)))];
                    case 1:
                        subject = (_a.sent())[0];
                        if (!subject) {
                            throw new Error('Subject not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.update(schema_1.subjects)
                                .set({
                                isArchived: true,
                                updatedAt: new Date()
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.subjects.id, subjectId))
                                .returning()];
                    case 2:
                        updatedSubject = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(userId, 'attendance', "Archived subject: ".concat(subject.name))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updatedSubject];
                }
            });
        });
    };
    // Semesters/CGPA methods
    DatabaseStorage.prototype.createSemester = function (userId, semesterData) {
        return __awaiter(this, void 0, void 0, function () {
            var newSemester;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.insert(schema_1.semesters)
                            .values(__assign({ userId: userId }, semesterData))
                            .returning()];
                    case 1:
                        newSemester = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(userId, 'gpa', "Added new semester: ".concat(semesterData.name))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newSemester];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateSemester = function (semesterId, userId, semesterData) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, updatedSemester;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.semesters).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.semesters.id, semesterId), (0, drizzle_orm_1.eq)(schema_1.semesters.userId, userId)))];
                    case 1:
                        semester = (_a.sent())[0];
                        if (!semester) {
                            throw new Error('Semester not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.update(schema_1.semesters)
                                .set(__assign(__assign({}, semesterData), { updatedAt: new Date() }))
                                .where((0, drizzle_orm_1.eq)(schema_1.semesters.id, semesterId))
                                .returning()];
                    case 2:
                        updatedSemester = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(userId, 'gpa', "Updated semester: ".concat(semesterData.name))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, updatedSemester];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserSemesters = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userSemesters, filteredSemesters;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getUserSemesters called with userId:", userId);
                        if (!userId) {
                            console.error("getUserSemesters called with invalid userId:", userId);
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, _db_1.db.query.semesters.findMany({
                                where: (0, drizzle_orm_1.eq)(schema_1.semesters.userId, userId),
                                orderBy: [(0, drizzle_orm_1.desc)(schema_1.semesters.createdAt)],
                                with: {
                                    courses: true
                                }
                            })];
                    case 1:
                        userSemesters = _a.sent();
                        console.log("Found", userSemesters.length, "semesters for user");
                        filteredSemesters = userSemesters.filter(function (s) { return s.userId === userId; });
                        if (filteredSemesters.length !== userSemesters.length) {
                            console.error("Data isolation issue detected - some semesters didn't match user ID!");
                        }
                        return [2 /*return*/, filteredSemesters];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSemesterWithCourses = function (semesterId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var semester;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.semesters.findFirst({
                            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.semesters.id, semesterId), (0, drizzle_orm_1.eq)(schema_1.semesters.userId, userId)),
                            with: {
                                courses: true
                            }
                        })];
                    case 1:
                        semester = _a.sent();
                        if (!semester) {
                            throw new Error('Semester not found or not owned by user');
                        }
                        return [2 /*return*/, semester];
                }
            });
        });
    };
    DatabaseStorage.prototype.createCourse = function (semesterId, courseData) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, newCourse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.semesters.findFirst({
                            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.semesters.id, semesterId), (0, drizzle_orm_1.eq)(schema_1.semesters.userId, courseData.userId)),
                        })];
                    case 1:
                        semester = _a.sent();
                        if (!semester) {
                            throw new Error('Semester not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.insert(schema_1.courses)
                                .values(__assign({ semesterId: semesterId }, courseData))
                                .returning()];
                    case 2:
                        newCourse = (_a.sent())[0];
                        return [4 /*yield*/, this.recordActivity(semester.userId, 'gpa', "Added course ".concat(courseData.name, " to ").concat(semester.name), JSON.stringify({ grade: courseData.grade, credits: courseData.credits }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, newCourse];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateCourse = function (courseId, courseData) {
        return __awaiter(this, void 0, void 0, function () {
            var course, semester, updatedCourse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select()
                            .from(schema_1.courses)
                            .where((0, drizzle_orm_1.eq)(schema_1.courses.id, courseId))];
                    case 1:
                        course = (_a.sent())[0];
                        if (!course) {
                            throw new Error('Course not found');
                        }
                        return [4 /*yield*/, _db_1.db.query.semesters.findFirst({
                                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.semesters.id, course.semesterId), (0, drizzle_orm_1.eq)(schema_1.semesters.userId, courseData.userId))
                            })];
                    case 2:
                        semester = _a.sent();
                        if (!semester) {
                            throw new Error('Course not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.update(schema_1.courses)
                                .set(__assign(__assign({}, courseData), { updatedAt: new Date() }))
                                .where((0, drizzle_orm_1.eq)(schema_1.courses.id, courseId))
                                .returning()];
                    case 3:
                        updatedCourse = (_a.sent())[0];
                        return [2 /*return*/, updatedCourse];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteCourse = function (courseId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var course, semester;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select()
                            .from(schema_1.courses)
                            .where((0, drizzle_orm_1.eq)(schema_1.courses.id, courseId))];
                    case 1:
                        course = (_a.sent())[0];
                        if (!course) {
                            throw new Error('Course not found');
                        }
                        return [4 /*yield*/, _db_1.db.query.semesters.findFirst({
                                where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.semesters.id, course.semesterId), (0, drizzle_orm_1.eq)(schema_1.semesters.userId, userId))
                            })];
                    case 2:
                        semester = _a.sent();
                        if (!semester) {
                            throw new Error('Course not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.delete(schema_1.courses).where((0, drizzle_orm_1.eq)(schema_1.courses.id, courseId))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Ideas methods
    // In storage.ts
    DatabaseStorage.prototype.createIdea = function (userId, ideaData) {
        return __awaiter(this, void 0, void 0, function () {
            var newIdea, userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.insert(schema_1.ideas)
                            .values(__assign({ userId: userId }, ideaData))
                            .returning()];
                    case 1:
                        newIdea = (_a.sent())[0];
                        return [4 /*yield*/, _db_1.db.query.users.findFirst({
                                where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId),
                                columns: { id: true, fullName: true, email: true, department: true }
                            })];
                    case 2:
                        userData = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, newIdea), { user: userData })]; // Attach user data
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllIdeas = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allIdeas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.ideas.findMany({
                            orderBy: [(0, drizzle_orm_1.desc)(schema_1.ideas.createdAt)],
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
                        })];
                    case 1:
                        allIdeas = _a.sent();
                        return [2 /*return*/, allIdeas];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserIdeas = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var userIdeas, filteredIdeas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("getUserIdeas called with userId:", userId);
                        if (!userId) {
                            console.error("getUserIdeas called with invalid userId:", userId);
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, _db_1.db.query.ideas.findMany({
                                where: (0, drizzle_orm_1.eq)(schema_1.ideas.userId, userId),
                                orderBy: [(0, drizzle_orm_1.desc)(schema_1.ideas.createdAt)],
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
                            })];
                    case 1:
                        userIdeas = _a.sent();
                        console.log("Found", userIdeas.length, "ideas for user");
                        filteredIdeas = userIdeas.filter(function (idea) { return idea.userId === userId; });
                        if (filteredIdeas.length !== userIdeas.length) {
                            console.error("Data isolation issue detected - some ideas didn't match user ID!");
                        }
                        return [2 /*return*/, filteredIdeas];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteIdea = function (ideaId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var idea;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.select().from(schema_1.ideas).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.ideas.id, ideaId), (0, drizzle_orm_1.eq)(schema_1.ideas.userId, userId)))];
                    case 1:
                        idea = (_a.sent())[0];
                        if (!idea) {
                            throw new Error('Idea not found or not owned by user');
                        }
                        return [4 /*yield*/, _db_1.db.delete(schema_1.ideas).where((0, drizzle_orm_1.eq)(schema_1.ideas.id, ideaId))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Flashcards methods
    DatabaseStorage.prototype.getFlashcardDecks = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.flashcardDecks.findMany({
                            orderBy: [(0, drizzle_orm_1.desc)(schema_1.flashcardDecks.name)]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getFlashcardsByDeck = function (deckId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.flashcards.findMany({
                            where: (0, drizzle_orm_1.eq)(schema_1.flashcards.deckId, deckId)
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Activity methods
    DatabaseStorage.prototype.recordActivity = function (userId, type, description, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var activity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.insert(schema_1.activities)
                            .values({
                            userId: userId,
                            type: type,
                            description: description,
                            metadata: metadata
                        })
                            .returning()];
                    case 1:
                        activity = (_a.sent())[0];
                        return [2 /*return*/, activity];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserActivities = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, limit) {
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _db_1.db.query.activities.findMany({
                            where: (0, drizzle_orm_1.eq)(schema_1.activities.userId, userId),
                            orderBy: [(0, drizzle_orm_1.desc)(schema_1.activities.createdAt)],
                            limit: limit
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DatabaseStorage;
}());
exports.storage = new DatabaseStorage();
