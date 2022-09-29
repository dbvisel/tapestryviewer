import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import { getTapestries } from "~/tapestryData";
import globalStyles from "~/styles/global.css";

export const links = () => {
  return [{ rel: "stylesheet", href: globalStyles }];
};

export const loader = async () => {
  return { tapestries: await getTapestries() };
};

export function meta() {
  return { title: "Tapestry Viewer" };
}

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/dark.css"
        ></link>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={data} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script src="https://hypothes.is/embed.js" async></script>
      </body>
    </html>
  );
}
