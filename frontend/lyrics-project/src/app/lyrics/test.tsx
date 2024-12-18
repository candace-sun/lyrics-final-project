export default async function Test({
  song,
  artist,
}: {
  song: string;
  artist: string;
}) {
  const data = await fetch(`http://127.0.0.1:5000/lyrics/${artist}/${song}`);
  const lyrics = await data.text();

  return <pre>{lyrics}</pre>;
}
