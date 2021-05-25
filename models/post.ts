import { Schema, Document, model } from 'mongoose';
import { IPost } from '../interfaces/interface';

const postSchema = new Schema({
    created: {
        type: Date
    },
    message: {
        type: String
    },
    imgs: [{
        type: String
    }],
    coords: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'user cannot be empty']
    }
})

postSchema.pre<IPost>('save', function( next ){
    this.created = new Date();
    next();
});

export const Post = model<IPost>('Post',postSchema);