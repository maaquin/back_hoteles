import mongoose, { Schema } from 'mongoose'

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    username:{
        type: String
    },
    password:{
        type: String
    },
    role:{
        type: String,
        required: true,
        enum: ["CLIENT_ROLE", "ADMIN_ROLE", "MANAGER_ROLE"],
        default: "CLIENT_ROLE"
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
    }
})

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
  }

export default mongoose.model('User', UserSchema)