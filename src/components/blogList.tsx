import { Blog } from "@/data/commands";

interface BlogListProps {
  data: Blog[];
  filtered?: boolean;
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export default function BlogList({ data, filtered }: BlogListProps) {
  return (
    <div className="w-full">
      <h2 className="text-xl lg:text-2xl flex flex-row gap-1 font-bold w-full">
        <p>Blog Posts</p> {filtered && <p className="text-sm">*</p>}
      </h2>
      <hr className="my-4" />

      <ul className="flex flex-col gap-2 lg:gap-8 px-4">
        {data.map((blog, i) => (
          <li key={blog.id} className="flex flex-col gap-2 px-1 lg:px-4">
            <h3 className="text-base lg:text-xl font-bold">{blog.title}</h3>
            <p className="text-sm lg:text-base">{blog.subtitle}</p>
            <p className="text-sm lg:text-base text-yellow">
              {dateFormat.format(new Date(blog.publishedAt))}
            </p>
            <a
              target="_blank"
              href={blog.url}
              className="text-blue hover:underline"
            >
              Read More
            </a>
            {i !== data.length - 1 && <hr className="my-2" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
