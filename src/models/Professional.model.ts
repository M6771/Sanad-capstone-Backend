import mongoose, { Schema, Document } from "mongoose";

export interface IProfessional extends Document {
    name: string;
    specialization?: string;
    bio?: string;
    phone?: string;
    email?: string;
    centerId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const professionalSchema = new Schema<IProfessional>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        specialization: {
            type: String,
            trim: true,
        },
        bio: {
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
        centerId: {
            type: Schema.Types.ObjectId,
            ref: "Center",
            index: true, // Index for fast filtering by center
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
professionalSchema.index({ name: 1 });
professionalSchema.index({ specialization: 1 });
professionalSchema.index({ centerId: 1 });

const Professional = mongoose.model<IProfessional>(
    "Professional",
    professionalSchema
);

export default Professional;
