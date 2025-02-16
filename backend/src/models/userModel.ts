import mongoose, { model } from "mongoose";

import * as bcrypt from "bcryptjs";


interface UserDocI extends Document{
    fullName: string;
    email:string;
    contactNumber:string;
    password:string;
    createdAt?: Date;
    isCorrectPassword: (candidatePassword:string)=> Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocI>({
    fullName: String,
    email: {
        type: String,
        require: [true, "An email required"],
    },
    contactNumber: String,
    password: {
        type: String,
        select: false

    },
    createdAt: {
        type:Date,
        default: new Date()
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password! , 12);
    next();
});



userSchema.methods.isCorrectPassword = async function (candidatePassword:string){
    return await bcrypt.compare(candidatePassword, this.password);
}


const User = model('User', userSchema);
export default User;