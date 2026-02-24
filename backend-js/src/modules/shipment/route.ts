import { Router } from 'express';
import { ShipmentController } from './controller';
import { authorizeRoles } from '../../middleware/rbac';
import { authenticate } from '../../middleware/authenticate'; // 1. IMPORT THIS
import { UserRole } from '../../types';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// Export - All logged in users can export their own (or all if admin) data
router.get('/export', authenticate, authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER), ShipmentController.export);

router.post('/upload', upload.single('file'), ShipmentController.uploadCSV);

// Viewer, Operations, and Admin can read shipments 
router.get("/", authenticate, authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER), ShipmentController.getAll);

// Only Operations and Admin can create shipments 
router.post('/',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS),
    ShipmentController.create
);

// Only Operations and Admin can update shipments
router.put('/:id/status',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS),
    ShipmentController.updateStatus
);

// Soft delete (Cancel) - Only Operations and Admin
router.delete('/:id',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS),
    ShipmentController.delete
);
router.get('/stats',
    authenticate,
    authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER),
    ShipmentController.getStats);
export default router;