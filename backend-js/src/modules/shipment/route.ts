import { Router } from 'express';
import { ShipmentController } from './controller';
import { authorizeRoles } from '../../middleware/rbac';
import { UserRole } from '../../types';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

// Export - All logged in users can export their own (or all if admin) data
router.get('/export', authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER), ShipmentController.export);

router.post('/upload', upload.single('file'), ShipmentController.uploadCSV);

router.get('/', authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER), ShipmentController.getAll);

router.post('/', authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS), ShipmentController.create);

router.put('/:id/status', authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS), ShipmentController.updateStatus);

router.delete('/:id', authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS), ShipmentController.delete);

export default router;