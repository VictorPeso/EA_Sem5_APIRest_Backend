import express from 'express';
import controller from '../controllers/Organizacion';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', ValidateJoi(Schemas.organizacion.create), controller.createOrganizacion);
router.get('/get/:organizacionId', controller.readOrganizacion);
router.get('/get', controller.readAll);
router.patch('/update/:organizacionId', ValidateJoi(Schemas.organizacion.update), controller.updateOrganizacion);
router.delete('/delete/:organizacionId', controller.deleteOrganizacion);

export = router;
