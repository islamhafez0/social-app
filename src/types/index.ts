import React from "react";

export type INewUser = {
  name: string;
  username: string;
  email: string;
  password: string;
};
export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  posts?: any;
};
export type TAuthContext = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type ISidebarLink = {
  imgURL: string;
  route: string;
  label: string;
};
export type FileUploaderProps = {
  handleFileChange: (FILES: File[]) => void;
  mediaUrl: string;
};
export type TNewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};
export type TUpdatePost = {
  postId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
  imageUrl: string;
  imageId: string;
};
export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};
