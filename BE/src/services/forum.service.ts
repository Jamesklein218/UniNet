import { inject, injectable } from "inversify";
import { Collection } from "mongodb";
import { DatabaseService } from "./database.service";
import { ServiceType } from "../types";
import { ObjectID } from "mongodb";
import { ForumPost, ForumComment } from "../models/forum.model";
import { ErrorInvalidData } from "../lib/errors";
import { User } from "../models/user.model";

@injectable()
export class ForumService {
    private posts_collection: Collection
    private comments_collection: Collection
    
    constructor(@inject(ServiceType.Database) private dbService: DatabaseService) {
        this.posts_collection = dbService.db.collection("posts")
        this.comments_collection = dbService.db.collection("comments")
        this.setupIndexes()
    }
    
    private async setupIndexes() {
    }
    
    async findPostByID(id: ObjectID) {
        return await this.posts_collection.findOne({ _id: id })
    }
    
    async queryPost(query: any) {
        return (await this.posts_collection.find(query).toArray()) as ForumPost[]
    }
    
    async updateOnePost(id: ObjectID, data: any) {
        await this.posts_collection.findOneAndUpdate(
            { _id: id },
            { $set: data }
        )
    }
    
    async pushIntoPost(id: ObjectID, data: any) {
        return await this.posts_collection.findOneAndUpdate(
            { _id: id },
            { $push: data }
        )
    }
    
    async pullFromPost(id: ObjectID, data: any) {
        return await this.posts_collection.findOneAndUpdate(
            { _id: id },
            { $pull: data }
        )
    }
    
    async deleteOnePost(id: ObjectID) {
        return await this.posts_collection.findOneAndDelete({ _id: id })
    }
    
    async findCommentByID(id: ObjectID) {
        return await this.comments_collection.findOne({ _id: id })
    }
    
    async updateOneComment(id: ObjectID, data: any) {
        return await this.comments_collection.findOneAndUpdate(
            { _id: id },
            { $set: data }
        )
    }
    
    async pushIntoComment(id: ObjectID, data: any) {
        return await this.comments_collection.findOneAndUpdate(
            { _id: id },
            { $push: data }
        )
    }

    async pullFromComment(id: ObjectID, data: any) {
        return await this.comments_collection.findOneAndUpdate(
            { _id: id },
            { $pull: data }
        )
    }
    
    async deleteOneComment(id: ObjectID) {
        return await this.comments_collection.findOneAndDelete({ _id: id })
    }
    
    async createPost(u: User, title: string, content: string) {
        title = title.trim()
        content = content.trim()
        
        if (title === "") {
            throw new ErrorInvalidData("Title cannot be empty")
        }
        if (content === "") {
            throw new ErrorInvalidData("Content cannot be empty")
        }

        const p: ForumPost = {
            by: u._id,
            author_name: u.name,
            author_username: u.username,
            at: Date.now(),
            title: title,
            content: content,
            comments: [],
            upvotes: [],
            downvotes: [],
        } as ForumPost
        
        const np = await this.posts_collection.insertOne(p)
        return np.ops[0]._id
    }
    
    async createComment(from_post: ObjectID, u: User, content: string) {
        content = content.trim()
        
        if (content === "") {
            throw new Error("Content of comment cannot be empty")
        }
        
        const c: ForumComment = {
            from_post: from_post,
            by: u._id,
            author_name: u.name,
            author_username: u.username,
            at: Date.now(),
            content: content,
            upvotes: [],
            downvotes: []
        } as ForumComment
        
        const nc = await this.comments_collection.insertOne(c)
        const id = nc.ops[0]._id
        
        await this.pushIntoPost(from_post, { comments: id })
        return id
    }
}