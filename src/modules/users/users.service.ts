import { UserModel } from "../../models/User.model";
import { ApiError } from "../../utils/apiError";

export const usersService = {
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
