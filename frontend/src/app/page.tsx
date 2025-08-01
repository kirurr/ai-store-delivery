import Link from "next/link";

export default async function Home() {
	return (<>
		<Link href="/signin">Sign In</Link>
		<Link href="/signup">Sign Up</Link>
	</>);
}
