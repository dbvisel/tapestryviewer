import { Outlet, Link, useLoaderData } from "remix";
import { getTapestries } from "~/tapestry";
import { cleanDate } from "~/utils/utils";

import adminStyles from "~/styles/admin.css";

export const links = () => {
  return [{ rel: "stylesheet", href: adminStyles }];
};

export const loader = async () => {
  return getTapestries();
};

export default function TapestryOverview() {
  const tapestries = useLoaderData();
  return (
    <div className="overview">
      <nav>
				<h1>Tapestries</h1>
				<ul>
					{tapestries.map(tapestry => (
						<li key={tapestry.slug}>
							<Link to={`${tapestry.slug}`}>{tapestry.title} ({cleanDate(tapestry.dateCreated)})</Link>
						</li>
					))}
				</ul>
				<h5><Link to={"/"}>Home</Link></h5>
      </nav>
      <main>
				<Outlet />
			</main>
    </div>
  );
}


