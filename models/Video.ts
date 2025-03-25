import mongoose, { Mongoose ,model,models,Schema} from "mongoose";

export const VIDEO_DIMENSIONS = {
  height:1080,
  width:1920
} as const

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export interface IVideo{
    _id?: mongoose.Types.ObjectId,
     title: string,
     description: string,
     videoUrl:string,
     thumbnailUrl:string,
     controls?:boolean,
     transformation?:{
        height:number,
        width:number,
        quality:number
     },
     createdAt?: Date;
     updatedAt?: Date;
     userId: mongoose.Types.ObjectId;
     url: string;
     caption: string;
     likes: mongoose.Types.ObjectId[];
     comments: {
       userId: mongoose.Types.ObjectId;
       content: string;
       createdAt: Date;
     }[];
}

const videoSchema = new Schema<IVideo>(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      videoUrl: { type: String, required: true },
      thumbnailUrl: { type: String, required: true },
      controls: { type: Boolean, default: true },
      transformation: {
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: { type: Number, min: 1, max: 100 },
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      url: {
        type: String,
        required: true
      },
      caption: {
        type: String,
        required: true,
        trim: true
      },
      likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }],
      comments: [commentSchema],
      createdAt:{type:Date,required:true},
      updatedAt:{type:Date,required:true},
    },
    { timestamps: true }
  );
  
  const Video = models?.Video || model<IVideo>("Video", videoSchema);
  
  export default Video;

