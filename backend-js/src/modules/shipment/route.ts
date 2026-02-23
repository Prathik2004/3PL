import { Router } from 'express';
import { ShipmentController } from './controller';
// import { authorizeRoles } from '../../middleware/rbac';
import { UserRole } from '../../types';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload', upload.single('file'), ShipmentController.uploadCSV);
// Viewer, Operations, and Admin can read shipments 
router.get('/', 
//   authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS, UserRole.VIEWER), 
  ShipmentController.getAll
);

// Only Operations and Admin can create or update shipments 
router.post('/', 
//   authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS), 
  ShipmentController.create
);


router.put('/:id/status', 
//   authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS), 
  ShipmentController.updateStatus
);

// Soft delete (Cancel)
router.delete('/:id', 
//   authorizeRoles(UserRole.ADMIN, UserRole.OPERATIONS), 
  ShipmentController.delete
);

export default router;