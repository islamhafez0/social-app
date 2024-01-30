import React, { useEffect, useState } from "react";
import { Models } from "appwrite";
import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/QueriesNMutations";
import { isLiked } from "@/common";
import Loader from "./Loader";

const PostStats = ({
  post,
  userId,
}: {
  post?: Models.Document;
  userId: string;
}) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { data } = useGetCurrentUser();
  const { mutate: handleLikePost } = useLikePost();
  const { mutate: saveSavedPost, isPending: isSaving } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isUnSaving } =
    useDeleteSavePost();

  function likePost(e: React.MouseEvent) {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    handleLikePost({ postId: post?.$id || "", likes: newLikes });
  }

  const savedPostRecord = data?.save.find(
    (record: Models.Document) => record.post.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [data]);

  function savePost(e: React.MouseEvent<HTMLImageElement>) {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavedPost({ savedRecordId: savedPostRecord.$id });
    }
    setIsSaved(true);
    saveSavedPost({ postId: post?.$id || "", userId: userId });
  }

  return (
    <div className="flex justify-between items-center z-10 gap-4">
      <div className="flex gap-1">
        <img
          src={
            isLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          className="cursor-pointer"
          width={20}
          height={20}
          onClick={likePost}
        />
        <p>{likes.length}</p>
      </div>
      <div className="flex gap-1">
        {isSaving || isUnSaving ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="like"
            className="cursor-pointer"
            width={20}
            height={20}
            onClick={savePost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
