import Search from "@/app/search/search";
import SearchResultsLayout from "@/app/search/searchResultsLayout";
import LoginButtons from "../shared/loginButtons";
import Image from "next/image";
import Link from "next/link";
import { FolderIcon } from "@heroicons/react/24/outline";
import { FolderOpenIcon } from "@heroicons/react/24/solid";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  return (
    <div className="m-4">
      <div className="mb-4 flex items-center justify-between">
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow inline-flex items-center group">
          <FolderIcon className="w-4 h-4 mr-2 group-hover:hidden" />
          <FolderOpenIcon className="w-4 h-4 mr-2 group-hover:flex hidden" />
          <Link href="/snippets">My Snippets</Link>
        </button>
        <div className="text-right">
          <LoginButtons />
        </div>
      </div>

      <div className="flex rounded-md max-w-full items-center bg-cat-purple mt-4 mb-4 text-white pl-4 shadow">
        <Image
          className="h-auto max-w-full rounded-md mt-5 ml-1 mb-3 mr-4"
          src="/rockcat-filled.png"
          width={130}
          height={38}
          alt="cat"
          priority
        />

        <div className="w-full mr-8">
          <div className="text-2xl font-bold mb-3 max-w-full">
            Search a song!
          </div>

          <Search placeholder="Search for a song..." />
        </div>
      </div>

      <div>
        <SearchResultsLayout query={query} />
      </div>
    </div>
  );
}
