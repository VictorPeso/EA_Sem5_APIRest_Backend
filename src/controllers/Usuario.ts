import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Usuario from '../models/Usuario';

const createUsuario = (req: Request, res: Response, next: NextFunction) => {
    const { organizacion, name } = req.body;

    const usuario = new Usuario({
        _id: new mongoose.Types.ObjectId(),
        organizacion,
        name
    });

    return usuario
        .save()
        .then((usuario) => res.status(201).json({ usuario }))
        .catch((error) => res.status(500).json({ error }));
};

const readUsuario = (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    return Usuario.findById(usuarioId)
        .populate('organizacion')
        .then((usuario) => (usuario ? res.status(200).json({ usuario }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Usuario.find()
        .then((usuarios) => res.status(200).json({ usuarios }))
        .catch((error) => res.status(500).json({ error }));
};

const updateUsuario = (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    return Usuario.findById(usuarioId)
        .then((usuario) => {
            if (usuario) {
                usuario.set(req.body);

                return usuario
                    .save()
                    .then((usuario) => res.status(201).json({ usuario }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteUsuario = (req: Request, res: Response, next: NextFunction) => {
    const usuarioId = req.params.usuarioId;

    return Usuario.findByIdAndDelete(usuarioId)
        .then((usuario) => (usuario ? res.status(201).json({ usuario, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createUsuario, readUsuario, readAll, updateUsuario, deleteUsuario };
