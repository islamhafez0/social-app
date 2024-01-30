import PostStats from "@/components/shared/PostStats";
import { useUserAuthContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
const PostsList = ({
  posts,
  showStats = true,
  showUser = true,
}: {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
}) => {
  const { user } = useUserAuthContext();
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl}
              className="object-cover h-full w-full"
              alt="post"
            />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center gap-2">
                <img
                  src={post.creator.imageUrl}
                  alt="avatar"
                  className="h-8 w-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PostsList;
