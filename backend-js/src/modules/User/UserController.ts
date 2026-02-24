import { Request, Response } from "express";
<<<<<<< HEAD
import UserModel from "../../models/UserModel.js";
=======
import UserModel from "../../models/user.js";
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({}, "-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

<<<<<<< HEAD
export const updateUser = async (req: Request, res: Response) => {
=======
export const updateUser = async (req: Request, res: Response): Promise<void> => {
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) { 
<<<<<<< HEAD
            return res.status(404).json({ message: "User not found" });
=======
            res.status(404).json({ message: "User not found" });
            return;
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

<<<<<<< HEAD
export const deleteUser = async (req: Request, res: Response) => {
=======
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
    const { id } = req.params;

    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
<<<<<<< HEAD
            return res.status(404).json({ message: "User not found" });
=======
            res.status(404).json({ message: "User not found" });
            return;
>>>>>>> 189f030a88f25e69b0488e69f314441e67b861e4
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
