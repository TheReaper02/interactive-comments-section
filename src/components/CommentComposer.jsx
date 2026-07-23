import { useContext, useState } from "react";
import { CommentsContext } from "../context/CommentsContext";

function CommentComposer({
  parentId = null,
  replyingTo = null,
  onSubmit,
  placeholder = "Write a comment...",
  submitLabel = "Send",
}) {
  const { state, dispatch } = useContext(CommentsContext);
  const mentionPrefix = parentId && replyingTo ? `@${replyingTo} ` : "";
  const [value, setValue] = useState(mentionPrefix);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    let cleanContent = trimmedValue;
    if (mentionPrefix && cleanContent.startsWith(mentionPrefix.trim())) {
      cleanContent = cleanContent
        .slice(mentionPrefix.trim().length)
        .trimStart();
    }

    if (!cleanContent.trim()) {
      return;
    }

    const newComment = {
      id: Date.now(),
      content: cleanContent,
      createdAt: "just now",
      score: 0,
      user: {
        image: state.currentUser.image,
        username: state.currentUser.username,
      },
      replies: [],
      ...(parentId ? { replyingTo } : {}),
    };

    dispatch({
      type: "ADD_COMMENT",
      payload: {
        parentId,
        comment: newComment,
      },
    });

    setValue(mentionPrefix);

    if (onSubmit) {
      onSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-4 rounded-xl border border-grey-100 bg-white p-4 shadow-sm md:flex-row md:items-start md:gap-4 md:p-6'>
      <img
        src={state.currentUser.image.png}
        alt={state.currentUser.username}
        className='h-10 w-10 rounded-full'
      />
      <div className='flex-1'>
        {mentionPrefix && (
          <p className='mb-2 inline-flex rounded-full bg-purple-200/40 px-3 py-1 text-xs font-semibold text-purple-600'>
            {mentionPrefix.trim()}
          </p>
        )}
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className='min-h-24 w-full rounded-lg border border-grey-100 px-4 py-3 text-sm text-grey-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200'
        />
      </div>
      <button
        type='submit'
        className='rounded-lg bg-purple-600 px-6 py-2 font-bold text-white transition hover:bg-purple-200 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200'>
        {submitLabel}
      </button>
    </form>
  );
}

export default CommentComposer;
