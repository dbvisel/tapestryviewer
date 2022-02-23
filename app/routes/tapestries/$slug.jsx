import { useLoaderData, Link } from "remix";
import invariant from "tiny-invariant";
import { getTapestryFromSlug } from "~/tapestry";


export const loader = async ({
  params
}) => {
	invariant(params.slug, "expected params.slug");
  return getTapestryFromSlug(params.slug);
};

export default function PostSlug() {
  const tapestry = useLoaderData();
	return (
    <div>
			<h5><Link to="/">Back</Link></h5>
			<h1>{tapestry.title}</h1>
			<div>
				{JSON.stringify(tapestry)}
			</div>
			<div>
				<h2>Items</h2>
				{tapestry.items.length ? <ul>{tapestry.items.map((item, index) => <li key={index}>{JSON.stringify(item)}</li>)}</ul> : <p>No items!</p>}
			</div>
			<div>
				<h2>History</h2>
				{tapestry.history.length ? <ul>{tapestry.history.map((history, index) => <li key={index}>{JSON.stringify(history)}</li>)}</ul> : <p>No history!</p>}
			</div>
		</div>
  );
}