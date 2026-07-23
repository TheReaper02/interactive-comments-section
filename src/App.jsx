import { CommentsContextProvider } from "./context/CommentsContext";
import CommentList from "./components/CommentList";

function App() {
  return (
    <CommentsContextProvider>
      <div className='flex min-h-screen flex-col items-center bg-grey-50'>
        <CommentList />
      </div>
    </CommentsContextProvider>
  );
}

export default App;
