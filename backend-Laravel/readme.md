### Laravel Backend Folder
backend/
├── app/
│   ├── Modules/              # Feature-based domains (The Core)
│   │   ├── Auth/             # JWT & RBAC logic
│   │   ├── Shipment/         # CRUD & Status management
│   │   ├── Exception/        # Automated Exception Engine (4 core rules)
│   │   ├── Dashboard/        # KPI & Analytics logic
│   │   └── CsvUpload/        # Bulk data processing
│   ├── Jobs/                 # Background tasks (Exception Engine, Daily Emails)
│   ├── Http/Middleware/      # JWT & Role-based guards
│   └── utils/                # Standardized Response & Date helpers
├── constants/                # Global Enums (ShipmentStatus, Roles)
├── routes/api.php            # Entry point (Loads all module routes)
└── tests/                    # Unit & Feature testing suite
