import Loader from "@/components/shared/Loader";
import CreatePostForm from "@/components/shared/PostForm";
import { useGetPost } from "@/lib/react-query/QueriesNMutations";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPost(id!);
  return (
    <div className="flex flex-1">
      <div className="common-container">
        {isLoading && <Loader />}
        <div className="flex-start max-w-5xl w-full gap-3">
          <img src="/assets/icons/edit.svg" alt="add-post" />
          <h2 className="h3-bold">Edit Post</h2>
        </div>
        {!isLoading && <CreatePostForm post={post} action="update" />}
      </div>
    </div>
  );
};

export default EditPost;
