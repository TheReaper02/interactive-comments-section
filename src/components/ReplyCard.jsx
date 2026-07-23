import { useState, useContext } from "react";
import { CommentsContext } from "../context/CommentsContext";
import ConfirmModal from "./ConfirmModal";
import CommentComposer from "./CommentComposer";

function ReplyCard({ reply, parentId }) {
  const { state, dispatch } = useContext(CommentsContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const voteKey = `${state.currentUser.username}:${reply.id}`;
  const voteMeta = state.userVotes?.[voteKey] ?? { vote: 0, switched: false };
  const currentVote =
    typeof voteMeta === "number" ? voteMeta : (voteMeta.vote ?? 0);
  const voteLocked =
    typeof voteMeta === "number" ? false : Boolean(voteMeta.switched);
  const isCurrentUser = reply.user.username === state.currentUser.username;

  function handleSave() {
    if (!editedContent.trim()) return;

    dispatch({
      type: "EDIT_COMMENT",
      payload: { commentId: reply.id, newContent: editedContent.trim() },
    });

    setIsEditing(false);
  }

  return (
    <>
      <div className='rounded-lg bg-grey-50 p-3 md:p-4'>
        <div className='flex items-start gap-3 md:gap-4'>
          <div className='hidden md:flex md:flex-col md:items-center md:gap-3 md:rounded-xl md:bg-white md:px-3 md:py-3'>
            <button
              onClick={() =>
                dispatch({
                  type: "VOTE",
                  payload: { commentId: reply.id, delta: 1 },
                })
              }
              className='rounded p-1 transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40'
              aria-label='upvote'
              disabled={currentVote === 1 || voteLocked}>
              <img
                src='/images/icon-plus.svg'
                alt=''
                aria-hidden='true'
                className='h-3 w-3'
              />
            </button>
            <span className='min-w-6 text-center text-base font-bold text-purple-600'>
              {reply.score}
            </span>
            <button
              onClick={() =>
                dispatch({
                  type: "VOTE",
                  payload: { commentId: reply.id, delta: -1 },
                })
              }
              className='rounded p-1 transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40'
              aria-label='downvote'
              disabled={
                currentVote === -1 ||
                voteLocked ||
                (reply.score === 0 && currentVote !== 1)
              }>
              <img
                src='/images/icon-minus.svg'
                alt=''
                aria-hidden='true'
                className='h-1 w-3'
              />
            </button>
          </div>

          <img
            src={reply.user.image.png}
            alt={reply.user.username}
            className='h-8 w-8 rounded-full'
          />

          <div className='flex-1'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex flex-wrap items-center gap-2'>
                <h4 className='font-bold text-grey-800'>
                  {reply.user.username}
                </h4>
                {isCurrentUser && (
                  <span className='rounded-sm bg-purple-600 px-1.5 py-0.5 text-xs font-bold text-white'>
                    you
                  </span>
                )}
                <span className='text-sm text-grey-500'>{reply.createdAt}</span>
              </div>

              <div className='hidden items-center gap-4 md:flex'>
                {isCurrentUser ? (
                  <>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className='inline-flex items-center gap-2 text-sm font-bold text-pink-400 transition hover:text-pink-200'>
                      <img
                        src='/images/icon-delete.svg'
                        alt=''
                        aria-hidden='true'
                        className='h-3 w-3'
                      />
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setEditedContent(reply.content);
                        setIsEditing(true);
                      }}
                      className='inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition hover:text-purple-200'>
                      <img
                        src='/images/icon-edit.svg'
                        alt=''
                        aria-hidden='true'
                        className='h-3 w-3'
                      />
                      Edit
                    </button>
                  </>
                ) : (
                  <button
                    type='button'
                    onClick={() => setIsReplying((value) => !value)}
                    className='inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition hover:text-purple-200'>
                    <img
                      src='/images/icon-reply.svg'
                      alt=''
                      aria-hidden='true'
                      className='h-3 w-4'
                    />
                    {isReplying ? "Cancel" : "Reply"}
                  </button>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className='mt-2'>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className='w-full rounded-lg border border-grey-100 px-3 py-2 text-sm text-grey-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200'
                />
                <div className='mt-2 flex gap-2'>
                  <button
                    onClick={handleSave}
                    className='rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-purple-200 hover:text-purple-600'>
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(reply.content);
                    }}
                    className='rounded-lg border border-grey-100 px-4 py-2 text-sm font-bold text-grey-500 transition hover:bg-grey-100'>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className='mt-3 text-[15px] leading-6 text-grey-500 md:text-base'>
                <span className='font-bold text-purple-600'>
                  {reply.replyingTo}
                </span>{" "}
                {reply.content}
              </p>
            )}

            <div className='mt-4 flex items-center justify-between md:hidden'>
              <div className='flex items-center gap-2 rounded-xl bg-white px-3 py-2'>
                <button
                  onClick={() =>
                    dispatch({
                      type: "VOTE",
                      payload: { commentId: reply.id, delta: 1 },
                    })
                  }
                  className='rounded p-1 transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40'
                  aria-label='upvote'
                  disabled={currentVote === 1 || voteLocked}>
                  <img
                    src='/images/icon-plus.svg'
                    alt=''
                    aria-hidden='true'
                    className='h-3 w-3'
                  />
                </button>
                <span className='min-w-6 text-center text-base font-bold text-purple-600'>
                  {reply.score}
                </span>
                <button
                  onClick={() =>
                    dispatch({
                      type: "VOTE",
                      payload: { commentId: reply.id, delta: -1 },
                    })
                  }
                  className='rounded p-1 transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40'
                  aria-label='downvote'
                  disabled={
                    currentVote === -1 ||
                    voteLocked ||
                    (reply.score === 0 && currentVote !== 1)
                  }>
                  <img
                    src='/images/icon-minus.svg'
                    alt=''
                    aria-hidden='true'
                    className='h-1 w-3'
                  />
                </button>
              </div>

              <div className='flex items-center gap-4'>
                {isCurrentUser ? (
                  <>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className='inline-flex items-center gap-2 text-sm font-bold text-pink-400 transition hover:text-pink-200'>
                      <img
                        src='/images/icon-delete.svg'
                        alt=''
                        aria-hidden='true'
                        className='h-3 w-3'
                      />
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setEditedContent(reply.content);
                        setIsEditing(true);
                      }}
                      className='inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition hover:text-purple-200'>
                      <img
                        src='/images/icon-edit.svg'
                        alt=''
                        aria-hidden='true'
                        className='h-3 w-3'
                      />
                      Edit
                    </button>
                  </>
                ) : (
                  <button
                    type='button'
                    onClick={() => setIsReplying((value) => !value)}
                    className='inline-flex items-center gap-2 text-sm font-bold text-purple-600 transition hover:text-purple-200'>
                    <img
                      src='/images/icon-reply.svg'
                      alt=''
                      aria-hidden='true'
                      className='h-3 w-4'
                    />
                    {isReplying ? "Cancel" : "Reply"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className='animate-reveal-up mt-3'>
          <p className='mb-2 text-sm font-medium text-grey-500'>
            Replying to{" "}
            <span className='font-bold text-purple-600'>
              @{reply.user.username}
            </span>
          </p>
          <CommentComposer
            parentId={parentId}
            replyingTo={reply.user.username}
            onSubmit={() => setIsReplying(false)}
            placeholder={`Reply to ${reply.user.username}...`}
            submitLabel='Reply'
          />
        </div>
      )}

      <ConfirmModal
        open={showDeleteModal}
        title='Delete reply'
        message='Are you sure you want to delete this reply? This action cannot be undone.'
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => {
          dispatch({
            type: "DELETE_COMMENT",
            payload: { commentId: reply.id },
          });
          setShowDeleteModal(false);
        }}
      />
    </>
  );
}

export default ReplyCard;
