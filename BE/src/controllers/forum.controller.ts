import { inject, injectable } from "inversify";
import { Controller } from "./controller";
import { Router } from "express";
import { Request, Response, ServiceType } from "../types";
import { EventService, AuthService, NotificationService, UserService, MapperService } from "../services";
import { ForumService } from "../services/forum.service";
import { ForumComment, ForumPost } from "../models/forum.model";
import { ErrorNotFound, ErrorUnauthorized } from "../lib/errors";
import { ObjectID } from "mongodb";
import { User } from "../models/user.model";

@injectable()
export class ForumController extends Controller {
    public readonly router = Router()
    public readonly path = '/forum'
    
    constructor(
        @inject(ServiceType.Event) private eventService: EventService,
        @inject(ServiceType.Auth) private authService: AuthService,
        @inject(ServiceType.Notification) private notiService: NotificationService,
        @inject(ServiceType.User) private userService: UserService,
        @inject(ServiceType.Mapper) private mapperService: MapperService,
        @inject(ServiceType.Forum) private forumService: ForumService
    ) {
        super()
        this.router.all("*", this.authService.authenticate())

        this.router.post("/createpost", this.createPost.bind(this))
        this.router.get("/allposts", this.getAllPosts.bind(this))
        this.router.get("/post/:postId", this.findPostById.bind(this))
        this.router.delete("/deletepost/:postId", this.deletePost.bind(this))
        this.router.post("/upvotepost/:postId", this.upvotePost.bind(this))
        this.router.post("/downvotepost/:postId", this.downvotePost.bind(this))
        
        this.router.post("/createcomment/:postId", this.createComment.bind(this))
        this.router.get("/allcomments/:postId", this.getAllCommentsOfPost.bind(this))
        this.router.get("/comment/:commentId", this.findCommentById.bind(this))
        this.router.delete("/deletecomment/:commentId", this.deleteComment.bind(this))
        this.router.post("/upvotecomment/:commentId", this.upvoteComment.bind(this))
        this.router.post("/downvotecomment/:commentId", this.downvoteComment.bind(this))
    }
    
    async createPost(req: Request, res: Response) {
        try {
            const userId = new ObjectID(req.tokenMeta.userId)
            const { title, content } = req.body

            const u = (await this.userService.findOne({ _id: userId })) as User
            const pid = await this.forumService.createPost(u, title, content)
            await this.userService.pushOne(userId, { posts: pid })

            res.composer.success(pid)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async getAllPosts(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            
            const a = await this.forumService.queryPost({})
            a.sort((x, y) => y.at - x.at)
            res.composer.success(a)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async deletePost(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const pid: ObjectID = new ObjectID(req.params.postId)
            
            const p = (await this.forumService.findPostByID(pid)) as ForumPost
            if (!p) {
                throw new ErrorNotFound(`The requested post doesn't exist`)
            }
            if (!p.by.equals(userId)) {
                throw new ErrorUnauthorized(`Cannot delete a post that you didn't create`)
            }
            
            // delete 'comments'
            for (const cid of p.comments) {
                const c = (await this.forumService.findCommentByID(cid)) as ForumComment
                // delete 'by', 'upvotes', 'downvotes' of this comment
                for (const uid of c.upvotes) {
                    await this.userService.pullOne(uid, { comment_upvotes: cid })
                }
                for (const uid of c.downvotes) {
                    await this.userService.pullOne(uid, { comment_downvotes: cid })
                }
                await this.userService.pullOne(c.by, { comments: cid })
                await this.forumService.deleteOneComment(cid)
            }
            
            // delete 'upvotes', 'downvotes' of this post
            for (const uid of p.upvotes) {
                await this.userService.pullOne(uid, { post_upvotes: pid })
            }
            for (const uid of p.downvotes) {
                await this.userService.pullOne(uid, { post_downvotes: pid })
            }
            
            // delete 'by'
            await this.userService.pullOne(userId, { posts: pid })
            
            // delete the actual post
            await this.forumService.deleteOnePost(pid)
            res.composer.success("Successfully deleted post!")
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async findPostById(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const pid: ObjectID = new ObjectID(req.params.postId)
            
            const p = (await this.forumService.findPostByID(pid)) as ForumPost
            if (!p) {
                throw new Error(`The requested post doesn't exist`)
            } else {
                res.composer.success(p)
            }
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async upvotePost(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const pid: ObjectID = new ObjectID(req.params.postId)
            
            const p = (await this.forumService.findPostByID(pid)) as ForumPost
            if (!p) {
                throw new Error(`The requested post does not exist`)
            }
            
            // toggle upvote status
            if (p.upvotes.some((u: ObjectID) => u.equals(userId))) {
                await this.forumService.pullFromPost(pid, { upvotes: userId })
                await this.userService.pullOne(userId, { post_upvotes: pid })
            } else {
                await this.forumService.pushIntoPost(pid, { upvotes: userId })
                await this.userService.pushOne(userId, { post_upvotes: pid })
                
                if (p.downvotes.some((u: ObjectID) => u.equals(userId))) {
                    await this.forumService.pullFromPost(pid, { downvotes: userId })
                    await this.userService.pullOne(userId, { post_downvotes: pid })
                }
            }
            
            res.composer.success("Toggled post upvote status")
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async downvotePost(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const pid: ObjectID = new ObjectID(req.params.postId)
            
            const p = (await this.forumService.findPostByID(pid)) as ForumPost
            if (!p) {
                throw new Error(`The requested post does not exist`)
            }
            
            // toggle downvote status
            if (p.downvotes.some((u: ObjectID) => u.equals(userId))) {
                await this.forumService.pullFromPost(pid, { downvotes: userId })
                await this.userService.pullOne(userId, { post_downvotes: pid })
            } else {
                await this.forumService.pushIntoPost(pid, { downvotes: userId })
                await this.userService.pushOne(userId, { post_downvotes: pid })
                
                if (p.upvotes.some((u: ObjectID) => u.equals(userId))) {
                    await this.forumService.pullFromPost(pid, { upvotes: userId })
                    await this.userService.pullOne(userId, { post_upvotes: pid })
                }
            }

            res.composer.success("Toggled post downvote status")
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async createComment(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const pid: ObjectID = new ObjectID(req.params.postId)
            const content = req.body.content
            
            const p = (await this.forumService.findPostByID(pid)) as ForumPost
            if (!p) {
                throw new Error(`The requested post does not exist`)
            }
            const u = (await this.userService.findOne({ _id: userId })) as User
            
            const cid = await this.forumService.createComment(pid, u, content)
            await this.userService.pushOne(userId, { comments: cid })
            
            res.composer.success(cid)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async getAllCommentsOfPost(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const postId: ObjectID = new ObjectID(req.params.postId)
            
            const p = (await this.forumService.findPostByID(postId)) as ForumPost
            if (!p) {
                throw new Error(`The requested post doesn't exist`)
            }
            
            let a: ForumComment[] = []
            for (const cid of p.comments) {
                a.push((await this.forumService.findCommentByID(cid) as ForumComment))
            }
            a.sort((x, y) => y.at - x.at)
            
            res.composer.success(a)
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }

    async findCommentById(req: Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const cid: ObjectID = new ObjectID(req.params.commentId)
            
            const p = (await this.forumService.findCommentByID(cid)) as ForumComment
            if (!p) {
                throw new Error(`The requested comment doesn't exist`)
            } else {
                res.composer.success(p)
            }
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }

    async deleteComment(req:Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const cid: ObjectID = new ObjectID(req.params.commendId)
            
            const c = (await this.forumService.findCommentByID(cid)) as ForumComment
            if (!c) {
                throw new Error(`The requested comment does not exist`)
            }
            if (!c.by.equals(userId)) {
                throw new Error(`You didn't create this comment...`)
            }
            
            // delete 'upvote', 'downvote'
            for (const u of c.upvotes) {
                await this.userService.pullOne(u, { comment_upvotes: cid })
            }
            for (const u of c.downvotes) {
                await this.userService.pullOne(u, { comment_downvotes: cid })
            }
            
            // delete 'by'
            await this.forumService.pullFromPost(c.by, { comments: cid })
            
            // delete the comment itself
            await this.forumService.deleteOneComment(cid)
            res.composer.success("Successfully deleted comment")
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
    
    async upvoteComment(req:Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const cid: ObjectID = new ObjectID(req.params.commentId)
            
            const c = (await this.forumService.findCommentByID(cid)) as ForumComment
            if (!c) {
                throw new Error(`The requested comment doesn't exist`)
            }
            
            // toggle upvote status
            if (c.upvotes.some(u => u.equals(userId))) {
                await this.forumService.pullFromComment(cid, { upvotes: userId })
                await this.userService.pullOne(userId, { comment_upvotes: cid })
            } else {
                await this.forumService.pushIntoComment(cid, { upvotes: userId })
                await this.userService.pushOne(userId, { comment_upvotes: cid })
                
                if (c.downvotes.some(u => u.equals(userId))) {
                    await this.forumService.pullFromComment(cid, { downvotes: userId })
                    await this.userService.pullOne(userId, { comment_downvotes: cid })
                }
            }
            
            res.composer.success("Toggled upvote comment status")
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }

    async downvoteComment(req:Request, res: Response) {
        try {
            const userId: ObjectID = new ObjectID(req.tokenMeta.userId)
            const cid: ObjectID = new ObjectID(req.params.commentId)
            
            const c = (await this.forumService.findCommentByID(cid)) as ForumComment
            if (!c) {
                throw new Error(`The requested comment doesn't exist`)
            }
            
            // toggle upvote status
            if (c.downvotes.some(u => u.equals(userId))) {
                await this.forumService.pullFromComment(cid, { downvotes: userId })
                await this.userService.pullOne(userId, { comment_downvotes: cid })
            } else {
                await this.forumService.pushIntoComment(cid, { downvotes: userId })
                await this.userService.pushOne(userId, { comment_downvotes: cid })
                
                if (c.upvotes.some(u => u.equals(userId))) {
                    await this.forumService.pullFromComment(cid, { upvotes: userId })
                    await this.userService.pullOne(userId, { comment_upvotes: cid })
                }
            }
            
            res.composer.success("Toggled upvote comment status")
        } catch(error) {
            console.log(error)
            res.composer.badRequest(error.message)
        }
    }
}