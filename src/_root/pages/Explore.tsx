import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import {
  useGetAllPosts,
  useSeacrchPosts,
} from "@/lib/react-query/QueriesNMutations";
import { useEffect, useState } from "react";
import PostsList from "./PostsList";

const Explore = () => {
  const [searchResults, setSearchResults] = useState<string>("");
  const { data: posts, fetchNextPage, hasNextPage } = useGetAllPosts();
  const debouncedValue = useDebounce(searchResults, 500);
  const {
    data: results,
    isLoading: isLoadingResults,
    isFetching: isFEtchingResults,
  } = useSeacrchPosts(debouncedValue);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (!searchResults && inView) fetchNextPage();
  }, [inView, searchResults]);

  if (!posts) {
    return (
      <div className="w-full flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResults = searchResults !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <section className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search For Posts</h2>
        <div className="flex bg-dark-4 gap-1 px-4 w-full rounded-lg">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchResults}
            onChange={(e) => setSearchResults(e.target.value)}
          ></Input>
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold mdd:h3-bold">Latest Updates</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            height={20}
            width={20}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isLoading={isLoadingResults}
            isFetching={isFEtchingResults}
            results={results}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End Of Posts</p>
        ) : (
          posts.pages.map((item, ix) => (
            <PostsList key={`page-${ix}`} posts={item?.documents || []} />
          ))
        )}
      </div>
      {hasNextPage && !searchResults && (
        <div className="mt-6" ref={ref}>
          <Loader />
        </div>
      )}
    </section>
  );
};

export default Explore;
