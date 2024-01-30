import { useUserAuthContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useTimeAgo } from "@/hooks/useTimeAgo";
const Post = ({ post }: { post: Models.Document }) => {
  const currentTimeAgo = useTimeAgo(post?.$createdAt);
  const { user } = useUserAuthContext();

  if (!post.creator) return null;
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post.creator.imageUrl || "https://i.pravatar.cc/300"}
              alt="avatar"
              className="object-cover w-12 h-12 rounded-full"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-4">
              <p className="subtle-semibold lg:Small-regular">
                {currentTimeAgo}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          className={`${user.id !== post.creator.$id && "hidden"}`}
          to={`/update-post/${post.$id}`}
        >
          <img
            src="/assets/icons/edit.svg"
            width={24}
            height={24}
            alt="edit-post"
          />
        </Link>
      </div>
      <Link className="block" to={`posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li className="text-light-3" key={tag}>{`#${tag}`}</li>
            ))}
          </ul>
        </div>
        <img src={post.imageUrl} className="post-card_img" alt="post image" />
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default Post;
