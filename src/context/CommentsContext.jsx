import { createContext, useReducer } from "react";
import Data from "../data/data.json";

const CommentsContext = createContext();

const initialState = {
  currentUser: Data.currentUser,
  comments: Data.comments,
  userVotes: {},
};

function CommentsContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CommentsContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentsContext.Provider>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_COMMENT": {
      if (action.payload.parentId === null) {
        return {
          ...state,
          comments: [...state.comments, action.payload.comment],
        };
      }

      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.parentId
            ? {
                ...comment,
                replies: [...comment.replies, action.payload.comment],
              }
            : comment,
        ),
      };
    }

    case "EDIT_COMMENT": {
      return {
        ...state,
        comments: state.comments.map((comment) => {
          if (comment.id === action.payload.commentId) {
            return {
              ...comment,
              content: action.payload.newContent,
            };
          }

          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === action.payload.commentId
                ? { ...reply, content: action.payload.newContent }
                : reply,
            ),
          };
        }),
      };
    }

    case "DELETE_COMMENT": {
      const id = action.payload.commentId;

      const updatedComments = state.comments.reduce((acc, comment) => {
        if (comment.id === id) return acc;

        const replies = comment.replies.filter((r) => r.id !== id);
        acc.push({ ...comment, replies });
        return acc;
      }, []);

      return { ...state, comments: updatedComments };
    }

    case "VOTE": {
      const { commentId, delta } = action.payload;
      const voteKey = `${state.currentUser.username}:${commentId}`;
      const existingVote = state.userVotes[voteKey] ?? {
        vote: 0,
        switched: false,
      };
      const currentVote =
        typeof existingVote === "number"
          ? existingVote
          : (existingVote.vote ?? 0);
      const hasSwitched =
        typeof existingVote === "number"
          ? false
          : Boolean(existingVote.switched);

      if (hasSwitched) {
        return state;
      }

      if (currentVote === delta) {
        return state;
      }

      const scoreDelta = delta;
      let didApplyVote = false;

      const updatedComments = state.comments.map((comment) => {
        if (comment.id === commentId) {
          const nextScore = Math.max(0, comment.score + scoreDelta);
          if (nextScore === comment.score) {
            return comment;
          }
          didApplyVote = true;
          return { ...comment, score: nextScore };
        }

        return {
          ...comment,
          replies: comment.replies.map((reply) => {
            if (reply.id !== commentId) {
              return reply;
            }

            const nextScore = Math.max(0, reply.score + scoreDelta);
            if (nextScore === reply.score) {
              return reply;
            }
            didApplyVote = true;
            return { ...reply, score: nextScore };
          }),
        };
      });

      if (!didApplyVote) {
        return state;
      }

      const switched = currentVote !== 0 && currentVote !== delta;

      return {
        ...state,
        comments: updatedComments,
        userVotes: {
          ...state.userVotes,
          [voteKey]: { vote: delta, switched },
        },
      };
    }

    default:
      return state;
  }
}

export { CommentsContext, CommentsContextProvider };
