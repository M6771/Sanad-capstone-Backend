import User from "../../models/User.model";
import { ApiError } from "../../middlewares/apiError";
import { HTTP_STATUS } from "../../config/constants";

export const usersService = {
    async getMe(userId: string) {
        const user = await User.findById(userId).select(
            "name email phone address createdAt updatedAt"
        );
        if (!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
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
        const user = await User.findByIdAndUpdate(userId, patch, {
            new: true,
        }).select("name email phone address createdAt updatedAt");
        if (!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
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
