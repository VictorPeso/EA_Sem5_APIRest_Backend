import express from 'express';
import controller from '../controllers/Usuario';
import { Schemas, ValidateJoi } from '../middleware/Joi';

const router = express.Router();

router.post('/create', ValidateJoi(Schemas.usuario.create), controller.createUsuario);
router.get('/get/:usuarioId', controller.readUsuario);
router.get('/get/', controller.readAll);
router.patch('/update/:usuarioId', ValidateJoi(Schemas.usuario.update), controller.updateUsuario);
router.delete('/delete/:usuarioId', controller.deleteUsuario);

export = router;
