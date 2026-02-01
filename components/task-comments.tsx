"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TaskCommentsProps {
    taskId: Id<"tasks">
}

export function TaskComments({ taskId }: TaskCommentsProps) {
    const comments = useQuery(api.comments.list, { taskId })
    const addComment = useMutation(api.comments.add)
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)
        try {
            await addComment({ taskId, content: newComment })
            setNewComment("")
        } catch (error) {
            console.error("Failed to add comment:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (comments === undefined) {
        return <div className="text-xs text-muted-foreground animate-pulse">Loading comments...</div>
    }

    return (
        <div className="space-y-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="size-4" />
                Comments ({comments.length})
            </div>

            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {comments.map((comment) => (
                    <div key={comment._id} className="bg-secondary/30 rounded-lg p-3 text-sm">
                        <p className="text-foreground">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                        </p>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No comments yet. Start the conversation!</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="h-8 text-sm"
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || isSubmitting}
                    className="h-8 w-8 p-0"
                >
                    <Send className="size-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
    )
}
