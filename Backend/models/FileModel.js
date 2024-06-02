import mongoose, {Schema} from "mongoose";

const FileSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true, 
    },
    description:{
        type: String,
        trim: true,
    },
    fileData:{
        type: String
    },
    public:{
        type:Boolean
    },
    archive:{
        type:Boolean
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        required: true, 
        ref:"User"
    }
},{
    timestamps: true
})

export const File = mongoose.model("File", FileSchema)