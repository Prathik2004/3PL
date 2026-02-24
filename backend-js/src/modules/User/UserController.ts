import { Request, Response } from "express";
import { User as UserModel } from "../../models/user";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({}, "-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) { 
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting user", error });
    }
};
