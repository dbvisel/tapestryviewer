import { Link, useLoaderData } from "remix";
import { getTapestries } from "~/tapestry";
import { cleanDate } from "~/utils/utils";

export const loader = async () => {
  return getTapestries();
};

export default function Posts() {
  const tapestries = useLoaderData();
  return (
    <div>
      <h1>Tapestries</h1>
			<ul>
        {tapestries.map(tapestry => (
          <li key={tapestry.slug}>
            <Link to={`${tapestry.slug}`}>{tapestry.title} ({cleanDate(tapestry.dateCreated)})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
