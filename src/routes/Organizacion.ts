import express from 'express';
import controller from '../controllers/Organizacion';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/', ValidateJoi(Schemas.organizacion.create), controller.createOrganizacion);
router.get('/:organizacionId', controller.readOrganizacion);
router.get('/', controller.readAll);
router.put('/:organizacionId', ValidateJoi(Schemas.organizacion.update), controller.updateOrganizacion);
router.delete('/:organizacionId', controller.deleteOrganizacion);

export default router;
