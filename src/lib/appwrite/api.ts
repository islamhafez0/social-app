import { INewUser, IUpdateUser, TNewPost, TUpdatePost } from "@/types";
import { account, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "./config";

const {
  databaseId,
  usersCollectionId,
  storageId,
  postsCollectionId,
  savesCollectionId,
} = appwriteConfig;

// Users Logic

export const createNewUser = async (user: INewUser) => {
  try {
    console.log(crypto.randomUUID());
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;
    const avatartUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDatabase({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatartUrl,
      username: user.username,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const signinAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
};

const saveUserToDatabase = async (user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) => {
  try {
    const newUser = await databases.createDocument(
      databaseId,
      usersCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getCurrentUser = async () => {
  const currentAccount = await account.get();
  if (!currentAccount) throw Error;

  const currentUser = await databases.listDocuments(
    databaseId,
    usersCollectionId,
    [Query.equal("accountId", currentAccount.$id)]
  );
  if (!currentUser) throw Error;
  return currentUser.documents[0];
};

export const logUserOut = async () => {
  try {
    const currentSession = account.deleteSession("current");
    return currentSession;
  } catch (error) {
    console.log(error);
  }
};

// Posts Logic

export const createPost = async (post: TNewPost) => {
  try {
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    const fileURL = getFilePreview(uploadedFile!.$id);
    if (!fileURL) {
      await deleteFile(uploadedFile!.$id);
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const newpost = await databases.createDocument(
      databaseId,
      postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        location: post.location,
        tags: tags,
        imageUrl: fileURL,
        imageId: uploadedFile?.$id,
      }
    );
    if (!newpost) {
      await deleteFile(uploadedFile!.$id);
      throw Error;
    }
    return newpost;
  } catch (error) {
    console.log(error);
  }
};

export const getRecentPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, postsCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(20),
    ]);
    if (!posts) throw Error("Something went wrong please try again!");
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getInfinitePosts = async ({
  pageParam,
}: {
  pageParam: number;
}) => {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      databaseId,
      postsCollectionId,
      queries
    );
    if (!posts) throw Error("No posts found");
    return posts;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchForPosts = async (searchTerm: string) => {
  try {
    const posts = await databases.listDocuments(databaseId, postsCollectionId, [
      Query.search("caption", searchTerm),
    ]);
    if (!posts) throw Error("No posts found");
    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const handleLikePost = async (postId: string, likes: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      databaseId,
      postsCollectionId,
      postId,
      {
        likes: likes,
      }
    );
    if (!updatedPost) throw Error;
  } catch (error) {
    console.log(error);
  }
};

export const handleSavePost = async (postId: string, userId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      databaseId,
      savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const handleDeleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(
      databaseId,
      savesCollectionId,
      savedRecordId
    );
    if (!statusCode)
      throw Error("Failed to delete document. Status code is falsy.");
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getPost = async (id?: string) => {
  if (!id) throw Error;
  try {
    const post = await databases.getDocument(databaseId, postsCollectionId, id);
    if (!post) throw Error;
    return post;
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (post: TUpdatePost) => {
  const hasFile = post.file.length > 0;
  try {
    let image: { imageUrl: string | URL; imageId: string } = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFile) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error("No File Uploaded");
      const fileUrl = getFilePreview(uploadedFile.$id);
      console.log("Delete");
      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        console.log("Delete");
        throw Error("");
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await databases.updateDocument(
      databaseId,
      postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!updatedPost) {
      if (hasFile) {
        await deleteFile(image.imageId);
      }
      throw Error;
    }
    if (hasFile) {
      await deleteFile(post.imageId);
    }
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (postId: string, imageId: string) => {
  if (!postId || !imageId) throw Error;
  try {
    await databases.deleteDocument(databaseId, postsCollectionId, postId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

// Helper Functions

const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), file);
    if (!uploadedFile) throw Error;
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
};

const getFilePreview = (id: string) => {
  try {
    const filePreview = storage.getFilePreview(
      storageId,
      id,
      2000,
      2000,
      "top",
      100
    );
    if (!filePreview) throw Error;
    return filePreview;
  } catch (error) {
    console.log(error);
  }
};

const deleteFile = async (id: string) => {
  try {
    await storage.deleteFile(storageId, id);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      databaseId,
      usersCollectionId,
      userId
    );
    if (!user) throw Error("User Not  Found");
    return user;
  } catch (error) {
    console.log(error);
  }
};
export const getUsers = async (limit?: number) => {
  const queries = [Query.orderDesc("$createdAt")];
  if (limit) {
    queries.push(Query.limit(limit));
  }
  try {
    const users = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      queries
    );
    if (!users) throw Error("Users not found");
    return users;
  } catch (error) {
    console.log(error);
  }
};

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      databaseId,
      usersCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}
