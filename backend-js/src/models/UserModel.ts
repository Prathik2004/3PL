import mongoose , {Schema , Document} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema : Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
}, {
    timestamps: true
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;

