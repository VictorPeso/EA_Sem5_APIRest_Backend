import express from 'express';
import controller from '../controllers/Usuario';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/', ValidateJoi(Schemas.usuario.create), controller.createUsuario);
router.get('/:usuarioId', controller.readUsuario);
router.get('/', controller.readAll);
router.put('/:usuarioId', ValidateJoi(Schemas.usuario.update), controller.updateUsuario);
router.delete('/:usuarioId', controller.deleteUsuario);

export default router;
