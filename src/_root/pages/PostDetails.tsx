import { useParams, Link } from "react-router-dom";
import { useGetPost } from "@/lib/react-query/QueriesNMutations";
import Loader from "@/components/shared/Loader";
import { useUserAuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import PostStats from "@/components/shared/PostStats";
import { timeAgo } from "@/common";
const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isError, isLoading } = useGetPost(id);
  const { user } = useUserAuthContext();
  console.log(post);
  return (
    <section className="post_details-container">
      {isError && (
        <pre className="text-base text-rose-500">
          Error while finding the post
        </pre>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={post?.creator.imageUrl || "https://i.pravatar.cc/300"}
                  alt="avatar"
                  className="object-cover w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-4">
                    <p className="subtle-semibold lg:Small-regular">
                      {timeAgo(post?.$createdAt || "")}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              {user.id === post?.creator.$id && (
                <div className="flex-center gap-4">
                  <Link to={`/update-post/${post?.$id}`}>
                    <img
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Link>
                  <Button variant="ghost" className="post_details-delete_btn">
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              )}
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col small-medium w-full flex-1">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li className="text-light-3" key={tag}>{`#${tag}`}</li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostDetails;
