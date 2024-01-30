import Loader from "@/components/shared/Loader";
import PostsList from "./PostsList";
import { useGetCurrentUser } from "@/lib/react-query/QueriesNMutations";

const LikedPosts = () => {
  const { data: currentUser, isLoading } = useGetCurrentUser();

  if (!currentUser || isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <PostsList posts={currentUser.liked} showStats={false} />
    </>
  );
};

export default LikedPosts;
