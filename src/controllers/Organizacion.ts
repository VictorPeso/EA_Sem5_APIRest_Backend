import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Organizacion from '../models/Organizacion';

const createOrganizacion = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const organizacion = new Organizacion({
        _id: new mongoose.Types.ObjectId(),
        name
    });

    return organizacion
        .save()
        .then((organizacion) => res.status(201).json({ organizacion }))
        .catch((error) => res.status(500).json({ error }));
};

const readOrganizacion = (req: Request, res: Response, next: NextFunction) => {
    const organizacionId = req.params.organizacionId;

    return Organizacion.findById(organizacionId)
        .then((organizacion) => (organizacion ? res.status(200).json({ organizacion }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Organizacion.find()
        .then((organizaciones) => res.status(200).json({ organizaciones }))
        .catch((error) => res.status(500).json({ error }));
};

const updateOrganizacion = (req: Request, res: Response, next: NextFunction) => {
    const organizacionId = req.params.organizacionId;

    return Organizacion.findById(organizacionId)
        .then((organizacion) => {
            if (organizacion) {
                organizacion.set(req.body);

                return organizacion
                    .save()
                    .then((organizacion) => res.status(201).json({ organizacion }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteOrganizacion = (req: Request, res: Response, next: NextFunction) => {
    const organizacionId = req.params.organizacionId;

    return Organizacion.findByIdAndDelete(organizacionId)
        .then((organizacion) => (organizacion ? res.status(201).json({ organizacion, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createOrganizacion, readOrganizacion, readAll, updateOrganizacion, deleteOrganizacion };
