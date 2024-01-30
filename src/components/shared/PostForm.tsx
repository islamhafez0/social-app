import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import PostFileUploader from "./PostFileUploader";
import FormInput from "@/components/shared/FormInput";
import { createPostFormSchema } from "@/lib/validation";
import { Models } from "appwrite";
import {
  useCreatePostMutation,
  useUpdatePost,
} from "@/lib/react-query/QueriesNMutations";
import { useUserAuthContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useEffect } from "react";

type PostFormProps = {
  action: "update" | "create";
  post?: Models.Document;
};

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending } = useCreatePostMutation();
  const { mutateAsync: updatePost, isPending: pendingUpdate } = useUpdatePost();
  const { user } = useUserAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof createPostFormSchema>>({
    resolver: zodResolver(createPostFormSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post.tags.join(", ") : "",
    },
  });

  const { formState } = form;
  useEffect(() => {
    const fetchData = async () => {
      if (action === "update" && post) {
        form.setValue("caption", post.caption);
        form.setValue("location", post.location);
        form.setValue("tags", post.tags.join(", "));
        if (post) {
          form.setValue("file", post.imageUrl);
        }
      }
    };
    fetchData();
  }, [action, post, form]);

  async function onSubmit(values: z.infer<typeof createPostFormSchema>) {
    if (post && action === "update") {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });
      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/posts/${post?.$id}`);
    }

    const newPost = await createPost({ ...values, userId: user.id });
    if (!newPost) {
      toast({
        title: "something went wrong ! please try again",
      });
    }
    navigate(`/posts/${newPost?.$id}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full md:max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <PostFileUploader
                  handleFileChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormInput
          type="text"
          name="location"
          form={form}
          label="Add Location"
        />
        <FormInput
          type="text"
          name="tags"
          form={form}
          label={`Add Tags (separeted by comma ",")`}
          placeholder="Learn, Art, Tech"
        />
        <div className="flex items-center gap-4 justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={!formState.isDirty || isPending || pendingUpdate}
          >
            {isPending || pendingUpdate ? (
              <>
                <Loader /> <p>Processing...</p>
              </>
            ) : (
              `${action === "create" ? "Create Post" : "Update Post"}`
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
