import { UserModel } from "../../models/User.model";
import { ApiError } from "../../utils/apiError";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signAccessToken } from "../../utils/jwt";

export const usersService = {
    async register(data: { name: string; email: string; password: string; phone?: number; address?: string }) {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: data.email.toLowerCase().trim() });
        if (existingUser) {
            throw new ApiError(409, "EMAIL_ALREADY_EXISTS", "Email is already registered");
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user
        const user = await UserModel.create({
            name: data.name.trim(),
            email: data.email.toLowerCase().trim(),
            passwordHash,
            phone: data.phone,
            address: data.address?.trim(),
        });

        // Generate token
        const token = signAccessToken(user._id.toString());

        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
        };
    },
    async login(email: string, password: string) {
        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
        }

        const token = signAccessToken(user._id.toString());

        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
        };
    },
    async getMe(userId: string) {
        const user = await UserModel.findById(userId).select(
            "name email phone address createdAt updatedAt"
        );
        if (!user) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    async updateMe(
        userId: string,
        patch: { name?: string; phone?: number; address?: string }
    ) {
        const user = await UserModel.findByIdAndUpdate(userId, patch, {
            new: true,
        }).select("name email phone address createdAt updatedAt");
        if (!user) {
            throw new ApiError(404, "USER_NOT_FOUND", "User not found");
        }
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },
};
