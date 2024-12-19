import Link from "next/link";
import { BACKEND_URL } from "../shared/backendURL";

export default async function SearchResultsLayout({
  query,
}: {
  query: string;
}) {
  let lst = [];

  type SearchResult = {
    artist: string;
    name: string;
  };

  if (query) {
    try {
      const data = await fetch(`${BACKEND_URL}/lyrics/search/${query}`);
      const res = await data.json();
      if (Object.keys(res).length) {
        lst = res["results"]["trackmatches"]["track"];
      } else {
        lst = [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ul>
      {lst.map((result: SearchResult) => (
        <li
          key={result.name + result.artist}
          className="hover:bg-gray-100 rounded-md shadow m-1 p-1.5 pl-3"
        >
          <Link href={`/lyrics?song=${result.name}&artist=${result.artist}`}>
            {result.name} - {result.artist}
          </Link>
        </li>
      ))}
    </ul>
  );
}
