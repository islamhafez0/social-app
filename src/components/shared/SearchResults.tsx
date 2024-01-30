import { Models } from "appwrite";

import Loader from "./Loader";
import PostsList from "@/_root/pages/PostsList";

const SearchResults = ({
  isLoading,
  results,
  isFetching,
}: {
  isLoading: boolean;
  isFetching: boolean;
  results: Models.DocumentList<Models.Document> | undefined;
}) => {
  console.log(results);
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center w-full">
        <Loader />
      </div>
    );
  }

  if (results && results?.documents.length > 0) {
    return <PostsList posts={results.documents} />;
  }

  return (
    <p className="text-light-4 w-full text-center mt-10">no results found</p>
  );
};

export default SearchResults;
