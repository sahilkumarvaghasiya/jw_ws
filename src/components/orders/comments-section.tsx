"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { Comment } from "@/lib/types";
import { Send } from "lucide-react";

interface CommentsSectionProps {
  comments: Comment[];
}

export function CommentsSection({ comments }: CommentsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-xs font-medium text-gold-dark shrink-0">
                  {comment.author.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 bg-muted/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground capitalize">{comment.authorRole}</span>
                    <span className="text-xs text-muted-foreground">· {formatDateTime(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-foreground/90">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-3 pt-2 border-t border-border">
          <Textarea placeholder="Add a comment..." rows={2} className="flex-1" />
          <Button className="self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
