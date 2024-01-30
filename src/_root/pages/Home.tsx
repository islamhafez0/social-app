import Loader from "@/components/shared/Loader";
import Post from "@/components/shared/Post";
import UserCard from "@/components/shared/UserCard";
import {
  useGetAllPosts,
  useGetAllUsers,
} from "@/lib/react-query/QueriesNMutations";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();
  const { hasNextPage, fetchNextPage, data, isLoading, isError } =
    useGetAllPosts();
  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUserError,
  } = useGetAllUsers(10);

  const posts = data?.pages.flatMap((page) => page.documents) || [];

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  console.log(posts);
  console.log(hasNextPage);

  const postsEnd = !hasNextPage && posts.length > 0;
  return (
    <section className="flex flex-1">
      <div className="home-container">
        <div className="home-posts w-full">
          {isError && (
            <pre className="text-base text-rose-500 text-left w-full text-wrap">
              Something went wrong please reload the page
            </pre>
          )}
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-1 flex-col gap-8 w-full">
              {posts?.map((post: Models.Document) => (
                <Post post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
        {!postsEnd ? (
          <div className="mt-6" ref={ref}>
            <Loader />
          </div>
        ) : (
          <p className="text-light-4 mt-10 text-center w-full">End Of Posts</p>
        )}
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserError && <p className="text-light-4"></p>}
        {!users || isUsersLoading ? (
          <div className="flex w-full items-center justify-center">
            <Loader />
          </div>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {users?.documents.map((user) => (
              <li key={user?.$id}>
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Home;
