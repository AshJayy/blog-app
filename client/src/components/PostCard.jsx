import { Link } from "react-router-dom";

export default function PostCard({post}) {
  return (
    <div className="group relative h-[400px] w-full sm:w-[430px] rounded-lg border hover:border-2 border-hl-purple overflow-hidden transition-all ">
      <Link to={`/post/${post.slug}`}>
        <img
            src={post.image}
            alt="post cover"
            className="h-[260px] w-full object-cover group-hover:h-[230px] transition-all duration-300 z-20 "
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2 ">{post.title}</p>
        <span className="text-sm italic">{post.category}</span>
        <Link
            to={`/post/${post.slug}`}
            className="p-2 z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border-2 border-hl-purple text-hl-purple hover:text-white dark:text-white text-center hover:bg-hl-purple  transition-all duration-300 rounded-md m-2"
        >
            Read Article
        </Link>
      </div>
    </div>
  )
}
