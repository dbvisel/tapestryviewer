import { Link, useLoaderData } from "remix";
import { getTapestries } from "~/tapestry";

export const loader = async () => {
  return getTapestries();
};

export default function Posts() {
  const tapestries = useLoaderData();
  console.log(tapestries);
  return (
    <div>
      <h1>Tapestries</h1>
			<ul>
        {tapestries.map(tapestry => (
          <li key={tapestry.slug}>
            <Link to={`${tapestry.slug}`}>{tapestry.title} ({tapestry.dateCreated})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
