import mongoose, { Schema, Document } from "mongoose";

export interface ICenter extends Document {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    professionalIds: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const centerSchema = new Schema<ICenter>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        professionalIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Professional",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
centerSchema.index({ name: 1 });
centerSchema.index({ professionalIds: 1 });

const Center = mongoose.model<ICenter>("Center", centerSchema);

export default Center;
