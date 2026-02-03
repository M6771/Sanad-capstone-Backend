import { Schema, model, Document, Types } from "mongoose";

export interface IChild extends Document {
    parentId: Types.ObjectId;
    name: string;
    dateOfBirth?: Date;
    gender?: string;
    medicalHistory?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ChildSchema = new Schema<IChild>(
    {
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true, // Index for fast queries by parent
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            trim: true,
        },
        medicalHistory: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ChildModel = model<IChild>("Child", ChildSchema);
