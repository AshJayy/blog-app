import { useEffect, useState } from "react"
import PostCard from "./PostCard";

export default function RecentArticles({limit}) {
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        try {
            const getRecentPosts = async () => {
                const url = `/api/post/getposts?limit=${limit}`;
                const res = await fetch(url);
                if(res.ok){
                    const data = await res.json();
                    setRecentPosts(data.posts);
                }else{
                    const error = await res.text();
                    console.log(error);
                }
            }
            getRecentPosts();
        } catch (error) {
            console.log(error.message);
        }
    })

  return (
    <div className="flex flex-col gap-5 justify-center items-center my-5">
        {recentPosts && recentPosts.length > 0 &&
            <>
                <h1 className="text-xl font-semibold">Recent Articles</h1>
                <div className="flex flex-wrap gap-5 justify-center">
                    {recentPosts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                        />
                    ))}
                </div>
            </>
        }
    </div>
  )
}
