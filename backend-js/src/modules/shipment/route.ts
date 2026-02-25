import { Router } from 'express';
import { ShipmentController } from './controller';
import { authorizeRoles } from '../../middleware/rbac';
import { authenticate } from '../../middleware/authenticate';
import { UserRole } from '../../types';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// ── Static routes MUST come before /:id wildcard ──────────────────────────────

// Dashboard stats
router.get(
    '/stats',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
    ShipmentController.getStats
);

// Filter-bar data helpers
router.get(
    '/clients',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
    ShipmentController.getClients
);

router.get(
    '/carriers',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
    ShipmentController.getCarriers
);

router.get(
    '/trends',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
    ShipmentController.getTrends
);

// Export shipments (CSV/XLSX)
router.get(
    '/export',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
    ShipmentController.export
);

// Bulk upload via CSV
router.post('/upload', authenticate, upload.single('file'), ShipmentController.uploadCSV);

// ── Collection routes ──────────────────────────────────────────────────────────

// Viewer, Operations, and Admin can list shipments
router.get(
    '/',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
    ShipmentController.getAll
);

// Only Admin can create shipments manually
router.post(
    '/',
    authenticate,
    authorizeRoles(UserRole.ADMIN),
    ShipmentController.create
);

// ── Parameterised routes (:id) — keep LAST ────────────────────────────────────

// Only Operations and Admin can update shipment status
router.put(
    '/:id/status',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS),
    ShipmentController.updateStatus
);

// Soft delete (Cancel) — Admin only
router.delete(
    '/:id',
    authenticate,
    authorizeRoles(UserRole.ADMIN),
    ShipmentController.delete
);

export default router;