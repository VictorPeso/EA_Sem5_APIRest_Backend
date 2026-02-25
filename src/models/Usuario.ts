import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario {
    name: string;
    organizacion: mongoose.Types.ObjectId | string;
}

export interface IUsuarioModel extends IUsuario, Document {}

const UsuarioSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        organizacion: { type: Schema.Types.ObjectId, required: true, ref: 'Organizacion' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IUsuarioModel>('Usuario', UsuarioSchema);
