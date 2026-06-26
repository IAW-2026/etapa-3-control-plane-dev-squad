"use client";

import { MessageSquarePlus } from "lucide-react";

type AddCommentCardProps = {
  comment: string;
  setComment: (val: string) => void;
  onAddComment: () => void;
  submittingComment: boolean;
};

export function AddCommentCard({
  comment,
  setComment,
  onAddComment,
  submittingComment,
}: AddCommentCardProps) {
  return (
    <div className="rounded-xl border border-border p-5 space-y-3">
      <div className="text-sm font-semibold">Agregar comentario</div>
      <div className="flex items-start gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribí una novedad sobre este envío (obligatorio)..."
          rows={2}
          className="flex-1 px-3 py-2 rounded-lg border border-border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-20 resize-none"
        />
        <button
          onClick={onAddComment}
          disabled={submittingComment || !comment.trim()}
          className="px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-30 shrink-0"
          title="Agregar comentario"
        >
          <MessageSquarePlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}