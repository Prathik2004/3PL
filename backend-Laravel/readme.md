### Laravel Backend Folder

backend/
    ├── app/   // All application PHP classes
        │   ├── Modules/   // Feature-based modular architecture
            │   │   ├── Auth/
                │   │   │   ├── Controllers/
                    │   │   │   │   └── AuthController.php   // login, logout, refresh
                │   │   │   ├── Services/
                    │   │   │   │   └── AuthService.php   // JWT logic, RBAC rules
                │   │   │   ├── Repositories/
                    │   │   │   │   └── AuthRepository.php   // DB queries only
                │   │   │   ├── Models/
                    │   │   │   │   └── User.php   // Extends MongoDB Model
                │   │   │   ├── Validators/
                    │   │   │   │   └── LoginValidator.php
                │   │   │   └── routes.php   // Auth route definitions
│   │   │
            │   │   ├── User/
                │   │   │   ├── Controllers/
                    │   │   │   │   └── UserController.php
                │   │   │   ├── Services/
                    │   │   │   │   └── UserService.php
                │   │   │   ├── Repositories/
                    │   │   │   │   └── UserRepository.php
                │   │   │   ├── Models/
                    │   │   │   │   └── User.php
                │   │   │   ├── Validators/
                    │   │   │   │   └── UserValidator.php
                │   │   │   └── routes.php
│   │   │
            │   │   ├── Shipment/
                │   │   │   ├── Controllers/
                    │   │   │   │   └── ShipmentController.php   // CRUD + status update
                │   │   │   ├── Services/
                    │   │   │   │   └── ShipmentService.php   // Validation rules, SRS logic
                │   │   │   ├── Repositories/
                    │   │   │   │   └── ShipmentRepository.php   // MongoDB queries
                │   │   │   ├── Models/
                    │   │   │   │   └── Shipment.php   // Schema + casts
                │   │   │   ├── Validators/
                    │   │   │   │   ├── CreateShipmentValidator.php
                    │   │   │   │   └── UpdateStatusValidator.php
                │   │   │   └── routes.php
│   │   │
            │   │   ├── Exception/
                │   │   │   ├── Controllers/
                    │   │   │   │   └── ExceptionController.php
                │   │   │   ├── Services/
                    │   │   │   │   └── ExceptionEngineService.php   // All 4 exception rules
                │   │   │   ├── Repositories/
                    │   │   │   │   └── ExceptionRepository.php
                │   │   │   ├── Models/
                    │   │   │   │   └── ShipmentException.php
                │   │   │   ├── Validators/
                │   │   │   └── routes.php
│   │   │
            │   │   ├── Dashboard/
                │   │   │   ├── Controllers/
                    │   │   │   │   └── DashboardController.php
                │   │   │   ├── Services/
                    │   │   │   │   └── DashboardService.php   // KPI formulas per SRS
                │   │   │   ├── Repositories/
                    │   │   │   │   └── DashboardRepository.php
                │   │   │   └── routes.php
│   │   │
            │   │   └── CsvUpload/
                │   │       ├── Controllers/
                    │   │       │   └── CsvUploadController.php
                │   │       ├── Services/
                    │   │       │   └── CsvUploadService.php   // Row validation, error report
                │   │       ├── Repositories/
                │   │       └── routes.php
│
        │   ├── Http/
            │   │   └── Middleware/
                │   │       ├── AuthenticateJwt.php   // Stateless JWT check
                │   │       ├── RoleMiddleware.php   // Admin / Operations / Viewer
                │   │       └── ForceJsonResponse.php   // Always return JSON
│   │
        │   └── Exceptions/
            │       └── Handler.php   // Global API error formatting
│
    ├── bootstrap/
        │   └── app.php   // App init, middleware, routes
│
    ├── config/   // All config files
        │   ├── app.php   // timezone: UTC
        │   ├── database.php   // MongoDB connection
        │   ├── auth.php   // JWT guards
        │   └── mail.php
│
    ├── database/
        │   ├── migrations/   // MongoDB index migrations
        │   └── seeders/   // Dev seed data
│
    ├── routes/
        │   └── api.php   // Loads all module routes.php files
│
    ├── app/Jobs/   // Queue jobs
        │   ├── RunExceptionEngine.php   // Scheduled — runs all 4 rules
        │   └── SendDailySummaryEmail.php   // Daily email digest
│
    ├── app/Events/
        │   └── NewExceptionCreated.php
│
    ├── utils/   // Reusable PHP helpers
        │   ├── ResponseHelper.php   // Standard JSON envelope
        │   ├── DateHelper.php   // UTC conversion utilities
        │   └── UuidHelper.php
│
    ├── constants/
        │   ├── ShipmentStatus.php   // Status enum values
        │   ├── ExceptionTypes.php
        │   └── Roles.php
│
    ├── tests/
        │   ├── Unit/   // Unit tests per SRS test cases
        │   └── Feature/   // API integration tests
│
    ├── logs/   // Laravel log files (git-ignored)
    ├── .env   // DB_CONNECTION=mongodb, JWT_SECRET
    ├── composer.json
    └── artisan
