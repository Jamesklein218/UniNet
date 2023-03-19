import { ObjectID } from "mongodb"

export interface ForumPost {
    _id: ObjectID
    by: ObjectID
    author_name: string
    author_username: string
    at: number
    title: string
    content: string
    comments: ObjectID[]
    upvotes: ObjectID[]
    downvotes: ObjectID[]
}

export interface ForumComment {
    _id: ObjectID
    from_post: ObjectID
    by: ObjectID
    author_name: string
    author_username: string
    at: number
    content: string
    upvotes: ObjectID[]
    downvotes: ObjectID[]
}
