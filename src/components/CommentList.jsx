import { useContext } from "react";
import { CommentsContext } from "../context/CommentsContext";
import CommentCard from "../components/CommentCard";
import CommentComposer from "./CommentComposer";

function CommentList() {
  const { state } = useContext(CommentsContext);

  return (
    <main className='mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8 md:gap-5 md:px-6 md:py-12'>
      {state.comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      <CommentComposer parentId={null} />
    </main>
  );
}

export default CommentList;
