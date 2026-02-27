import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganizacion {
    name: string;
}

export interface IOrganizacionModel extends IOrganizacion, Document {}

const OrganizacionSchema: Schema = new Schema(
    {
        usuarios: [{ type: Schema.Types.ObjectId, ref: 'Usuario' }]
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IOrganizacionModel>('Organizacion', OrganizacionSchema);
