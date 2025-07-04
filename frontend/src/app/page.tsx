import Image from "next/image";

async function fetchTest(): Promise<{ data: any | null; error: Error | null }> {
  try {
    const res = await fetch("http://cms:1337/api/tests");
    if (!res.ok) {
      throw new Error("Fetched response was not ok");
    }
    return { data: await res.json(), error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e as Error };
  }
}

export default async function Home() {
  const { data, error } = await fetchTest();
  if (error) {
    return <div>Error: {error.message} nigga</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }
  return <div>
		{data.data.map((test: any) => 
			<h1>Hello {test.test}</h1>
		)}
	</div>;
}
