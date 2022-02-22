import { Link, useLoaderData } from "remix";
import { getPosts } from "~/post";

export const loader = async () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData();
  console.log(posts);
  return (
    <div>
      <h1>Posts</h1>
			<ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link to={`/post/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
