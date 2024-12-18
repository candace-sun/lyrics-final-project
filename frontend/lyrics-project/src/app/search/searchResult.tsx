export default function SearchResult({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  return <>{query + currentPage + ""}</>;
}
