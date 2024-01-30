import CreatePostForm from "@/components/shared/PostForm";

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start max-w-5xl w-full gap-3">
          <img src="/assets/icons/add-post.svg" alt="add-post" />
          <h2 className="h3-bold">Create Post</h2>
        </div>
        <CreatePostForm action="create" />
      </div>
    </div>
  );
};

export default CreatePost;
