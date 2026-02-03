import { Types } from "mongoose";
import { ChildModel } from "../../models/Child.model";
import { ApiError } from "../../utils/apiError";
import { CreateChildBody, UpdateChildBody } from "./children.schemas";

function toObjId(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new ApiError(400, "INVALID_ID", "Invalid id");
    return new Types.ObjectId(id);
}

export const childrenService = {
    async create(userId: string, data: any) {
        const child = await ChildModel.create({
            parentId: toObjId(userId),
            name: data.name,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            gender: data.gender,
            medicalHistory: data.medicalHistory,
        });

        return { id: child._id.toString(), name: child.name };
    },

    async list(userId: string) {
        const rows = await ChildModel.find({ parentId: toObjId(userId) }).sort({ createdAt: -1 });
        return rows.map((c) => ({
            id: c._id.toString(),
            parentId: c.parentId.toString(),
            name: c.name,
            dateOfBirth: c.dateOfBirth,
            gender: c.gender,
            medicalHistory: c.medicalHistory,
            notes: c.notes,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        }));
    },

    async get(userId: string, childId: string) {
        const child = await ChildModel.findOne({ _id: toObjId(childId), parentId: toObjId(userId) });
        if (!child) throw new ApiError(404, "CHILD_NOT_FOUND", "Child not found");
        return {
            id: child._id.toString(),
            name: child.name,
            dateOfBirth: child.dateOfBirth,
            gender: child.gender,
            medicalHistory: child.medicalHistory,
            notes: child.notes,
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
        };
    },

    async update(userId: string, childId: string, patch: any) {
        const updateData: any = {};
        if (patch.name !== undefined) updateData.name = patch.name;
        if (patch.dateOfBirth !== undefined) {
            updateData.dateOfBirth = typeof patch.dateOfBirth === "string" ? new Date(patch.dateOfBirth) : patch.dateOfBirth;
        }
        if (patch.gender !== undefined) updateData.gender = patch.gender;
        if (patch.medicalHistory !== undefined) updateData.medicalHistory = patch.medicalHistory;

        const child = await ChildModel.findOneAndUpdate(
            { _id: toObjId(childId), parentId: toObjId(userId) },
            updateData,
            { new: true }
        );
        if (!child) throw new ApiError(404, "CHILD_NOT_FOUND", "Child not found");
        return { id: child._id.toString(), name: child.name };
    },

    /**
     * Create a new child for a parent
     */
    async createChild(parentId: string, data: CreateChildBody) {
        const childData: any = {
            parentId,
            name: data.name,
        };

        if (data.dateOfBirth) {
            childData.dateOfBirth = typeof data.dateOfBirth === "string"
                ? new Date(data.dateOfBirth)
                : data.dateOfBirth;
        }
        if (data.gender) childData.gender = data.gender;
        if (data.medicalHistory) childData.medicalHistory = data.medicalHistory;
        if (data.notes) childData.notes = data.notes;

        const child = await ChildModel.create(childData);

        return {
            id: child._id.toString(),
            parentId: child.parentId.toString(),
            name: child.name,
            dateOfBirth: child.dateOfBirth,
            gender: child.gender,
            medicalHistory: child.medicalHistory,
            notes: child.notes,
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
        };
    },

    /**
     * Update a child (with ownership check)
     */
    async updateChild(childId: string, parentId: string, data: UpdateChildBody) {
        const updateData: any = {};

        if (data.name !== undefined) updateData.name = data.name;
        if (data.dateOfBirth !== undefined) {
            updateData.dateOfBirth = typeof data.dateOfBirth === "string"
                ? new Date(data.dateOfBirth)
                : data.dateOfBirth;
        }
        if (data.gender !== undefined) updateData.gender = data.gender;
        if (data.medicalHistory !== undefined) updateData.medicalHistory = data.medicalHistory;
        if (data.notes !== undefined) updateData.notes = data.notes;

        const child = await ChildModel.findOneAndUpdate(
            { _id: toObjId(childId), parentId: toObjId(parentId) },
            updateData,
            { new: true, runValidators: true }
        ).select("-__v");

        if (!child) {
            throw new ApiError(404, "CHILD_NOT_FOUND", "Child not found");
        }

        return {
            id: child._id.toString(),
            parentId: child.parentId.toString(),
            name: child.name,
            dateOfBirth: child.dateOfBirth,
            gender: child.gender,
            medicalHistory: child.medicalHistory,
            notes: child.notes,
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
        };
    },

    async remove(userId: string, childId: string) {
        const child = await ChildModel.findOneAndDelete({ _id: toObjId(childId), parentId: toObjId(userId) });
        if (!child) throw new ApiError(404, "CHILD_NOT_FOUND", "Child not found");
        return { ok: true };
    },
};
