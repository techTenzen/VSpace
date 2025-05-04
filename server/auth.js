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
exports.hashPassword = hashPassword;
exports.comparePasswords = comparePasswords;
exports.setupAuth = setupAuth;
var passport_1 = require("passport");
var passport_local_1 = require("passport-local");
var express_session_1 = require("express-session");
var crypto_1 = require("crypto");
var util_1 = require("util");
var storage_1 = require("./storage");
var scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, buf;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    salt = (0, crypto_1.randomBytes)(16).toString("hex");
                    return [4 /*yield*/, scryptAsync(password, salt, 64)];
                case 1:
                    buf = (_a.sent());
                    return [2 /*return*/, "".concat(buf.toString("hex"), ".").concat(salt)];
            }
        });
    });
}
function comparePasswords(supplied, stored) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, hashed, salt, hashedBuf, suppliedBuf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = stored.split("."), hashed = _a[0], salt = _a[1];
                    hashedBuf = Buffer.from(hashed, "hex");
                    return [4 /*yield*/, scryptAsync(supplied, salt, 64)];
                case 1:
                    suppliedBuf = (_b.sent());
                    return [2 /*return*/, (0, crypto_1.timingSafeEqual)(hashedBuf, suppliedBuf)];
            }
        });
    });
}
function setupAuth(app) {
    var _this = this;
    var sessionSettings = {
        secret: process.env.SESSION_SECRET || "vitskillspace_secret",
        resave: false,
        saveUninitialized: false,
        store: storage_1.storage.sessionStore,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: process.env.NODE_ENV === "production" && !process.env.DEV_HTTPS,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            httpOnly: true
        }
    };
    app.set("trust proxy", 1);
    app.use((0, express_session_1.default)(sessionSettings));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: "email",
        passwordField: "password",
    }, function (email, password, done) { return __awaiter(_this, void 0, void 0, function () {
        var user, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, storage_1.storage.getUserByEmail(email)];
                case 1:
                    user = _b.sent();
                    _a = !user;
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, comparePasswords(password, user.password)];
                case 2:
                    _a = !(_b.sent());
                    _b.label = 3;
                case 3:
                    if (_a) {
                        return [2 /*return*/, done(null, false)];
                    }
                    else {
                        return [2 /*return*/, done(null, user)];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    return [2 /*return*/, done(error_1)];
                case 5: return [2 /*return*/];
            }
        });
    }); }));
    passport_1.default.serializeUser(function (user, done) { return done(null, user.id); });
    passport_1.default.deserializeUser(function (id, done) { return __awaiter(_this, void 0, void 0, function () {
        var user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage_1.storage.getUser(id)];
                case 1:
                    user = _a.sent();
                    done(null, user);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    done(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/register", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var existingUser, user_1, _a, _b, _c, error_3;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, storage_1.storage.getUserByEmail(req.body.email)];
                case 1:
                    existingUser = _e.sent();
                    if (existingUser) {
                        return [2 /*return*/, res.status(400).json({ message: "Email already registered" })];
                    }
                    _b = (_a = storage_1.storage).createUser;
                    _c = [__assign({}, req.body)];
                    _d = {};
                    return [4 /*yield*/, hashPassword(req.body.password)];
                case 2: return [4 /*yield*/, _b.apply(_a, [__assign.apply(void 0, _c.concat([(_d.password = _e.sent(), _d)]))])];
                case 3:
                    user_1 = _e.sent();
                    req.login(user_1, function (err) {
                        if (err)
                            return next(err);
                        res.status(201).json(user_1);
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _e.sent();
                    next(error_3);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/login", function (req, res, next) {
        passport_1.default.authenticate("local", function (err, user, info) {
            if (err)
                return next(err);
            if (!user)
                return res.status(401).json({ message: "Invalid email or password" });
            req.login(user, function (err) {
                if (err)
                    return next(err);
                return res.status(200).json(user);
            });
        })(req, res, next);
    });
    app.post("/api/logout", function (req, res, next) {
        req.logout(function (err) {
            if (err)
                return next(err);
            res.status(200).json({ message: "Logout successful" });
        });
    });
    app.get("/api/user", function (req, res) {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        res.json(req.user);
    });
    app.put("/api/user/onboarding", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var updatedUser, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.isAuthenticated())
                        return [2 /*return*/, res.status(401).json({ message: "Not authenticated" })];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, storage_1.storage.completeOnboarding(req.user.id, req.body)];
                case 2:
                    updatedUser = _a.sent();
                    res.json(updatedUser);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    next(error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
}
