import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import 'react-quill/dist/quill.snow.css';
import CallToAction from "../components/CallToAction";
import CommentsSection from "../components/CommentsSection";

export default function UpdatePost() {

    const {postSlug} = useParams();

    const [post, setPost] = useState({
        _id: '',
        title: '',
        category: 'uncategorized',
        image: '',
        content: '',
        date: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
                return;
            }
            if (res.ok && data.posts.length > 0) {
                setLoading(false);
                setPost({
                    _id: data.posts[0]._id,
                    title: data.posts[0].title,
                    category: data.posts[0].category,
                    image: data.posts[0].image,
                    content: data.posts[0].content,
                    date: data.posts[0].createdAt
                });
            }else{
                setLoading(false);
                setError(true);
            }
        };
        try {
            fetchPost()
        } catch (error) {
            setLoading(false);
            setError(true);
            console.log('Error fetching Post' + error.message);
        }
      }, [postSlug]);

      if(loading){
        return (
            <div className="min-h-screen w-full flex justify-center">
                <Spinner className="w-10 h-10 mt-64" />
            </div>
        )
      }

      if(error){
        return(
            <div className="min-h-screen w-full flex justify-center">
                <p className="mt-64 text-lg text-gray-500 dark:text-gray-400">Could not find the post you're looking for.</p>
            </div>
        )
      }


  return (
    // TODO: add loading
    <main className="p-3 max-w-3xl min-h-screen mx-auto flex flex-col">
        <h1 className="mt-10 mb-5 max-w-2xl text-center text-3xl lg:text-4xl font-serif mx-auto">{post && post.title}</h1>
        <Link to={`/search?category=${post && post.category}`} className="self-center">
            <Button color='gray' pill size='xs' className="w-fit">
                {post && post.category}
            </Button>
        </Link>
        <img
            src={post && post.image}
            alt={post && post.title}
            className="mt-8 p-3 max-g-[600px] w-full object-cover"
        />
        <div className="p-3 flex flex-row justify-between w-full mx-auto max-w-2xl text-gray-400 text-xs italic border-b-2 border-purple-500">
            <span>{post && new Date(post.date).toLocaleDateString()}</span>
            <span>{post && (post.content.length/1000).toFixed()} mins read</span>
        </div>
        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post && post.content}}>
        </div>
        <div className="max-w-4xl mx-auto w-full">
            <CallToAction />
        </div>
        <CommentsSection postID={post._id} />
    </main>
  )
}
