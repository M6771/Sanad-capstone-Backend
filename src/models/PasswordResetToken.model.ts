import mongoose, { Schema, Document } from "mongoose";

export interface IPasswordResetToken extends Document {
    user: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    used: boolean;
    usedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
        usedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for automatic cleanup of expired tokens
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index on user field for faster lookups when finding tokens by user
passwordResetTokenSchema.index({ user: 1 });

// Compound index for finding valid (unused, not expired) tokens
passwordResetTokenSchema.index({ user: 1, used: 1, expiresAt: 1 });

const PasswordResetToken = mongoose.model<IPasswordResetToken>(
    "PasswordResetToken",
    passwordResetTokenSchema
);

export default PasswordResetToken;
