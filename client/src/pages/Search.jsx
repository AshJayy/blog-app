import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import PostCard from '../components/PostCard'

export default function Search() {

    const location = useLocation();
    const navigate = useNavigate();

    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'all',
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true)

    useEffect(() => {
        const URLParams = new URLSearchParams(location.search);
        const searchTermFromURL = URLParams.get('searchTerm');
        const sortFromURL = URLParams.get('sort');
        const categoryFromURL = URLParams.get('category');
        if(searchTermFromURL || sortFromURL || categoryFromURL){
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromURL,
                sort: sortFromURL,
                category: categoryFromURL,
            });
        }

        const fetchPosts = async () => {
            setLoading(true)
            try {
                const searchQuery = URLParams.toString();
                const res = await fetch(`api/post/getposts?${searchQuery}`)
                const data = await res.json();
                if(!res.ok){
                  console.log('Failed to fetch posts');
                  setLoading(false);
                }
                if(res.ok){
                    setPosts(data.posts);
                    if(data.posts.length < 9){
                        setShowMore(false);
                    }
                  setLoading(false);
                }
                console.log(posts);
              } catch (error) {
                console.log(error.message);
              }
        }
        fetchPosts();
    }, [location.search])

    const handleChange = (e) => {
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value});
        }
        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc';
            setSidebarData({...sidebarData, sort: order});
        }
        if(e.target.id === 'category'){
            const category = e.target.value || 'all';
            setSidebarData({...sidebarData, category: category});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const URLParams = new URLSearchParams(location.search);
        URLParams.set('searchTerm', sidebarData.searchTerm);
        URLParams.set('sort', sidebarData.sort);
        URLParams.set('category', (sidebarData.category === 'all' ? '' : sidebarData.category));

        const searchQuery = URLParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShowMore = async () => {
        const URLParams = new URLSearchParams(location.search);
        URLParams.set('searchTerm', sidebarData.searchTerm);
        URLParams.set('sort', sidebarData.sort);
        URLParams.set('category', (sidebarData.category === 'all' ? '' : sidebarData.category));

        const searchQuery = URLParams.toString();
        const startIndex = posts.length;
        try {
        const res = await fetch(`api/post/getposts?startIndex=${startIndex}&${searchQuery}`)
        const data = await res.json();
        if(res.ok){
            setPosts((prev) => [...prev, ...data.posts]);
            if(data.posts.length < 9){
            setShowMore(false);
            }
        }
        } catch (error) {
        console.log(error.message);
        }
    }

  return (
    <div className="flex flex-col sm:flex-row">
        <div id="sidebar">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 pt-10 w-full sm:w-72 sm:min-h-screen sm:h-full items-center bg-gray-100 dark:bg-gray-800">
                <div className="flex gap-3 items-center text-sm w-full">
                    <label className="text-nowrap w-32">Search Term: </label>
                    <TextInput
                        placeholder="Search..."
                        id="searchTerm"
                        type="text"
                        value={sidebarData.searchTerm}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>
                <div className="flex gap-3 items-center text-sm w-full">
                    <label className="text-nowrap w-32">Sort: </label>
                    <Select
                        id="sort"
                        className="w-full"
                        onChange={handleChange}
                        value={sidebarData.sort}
                    >
                        <option value='desc'>Latest</option>
                        <option value='asc'>Earliest</option>
                    </Select>
                </div>
                <div className="flex gap-3 items-center text-sm w-full">
                    <label className="text-nowrap w-32">Category: </label>
                    <Select
                        id="category"
                        className="w-full"
                        onChange={handleChange}
                        value={sidebarData.category}
                    >
                        <option value='all'>All</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                    </Select>
                </div>
                <Button gradientDuoTone="pinkToOrange" outline className="w-32" type="submit">
                    Apply Filters
                </Button>
            </form>
        </div>
        <div id="search-results" className="flex flex-wrap gap-4 p-10">
            {loading &&
                <div className="flex gap-2 text-gray-400">
                    <Spinner />
                    <p>Loading...</p>
                </div>
            }
            {!loading && posts && posts.length > 0 && (
                <>
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                        />
                    ))}
                </>
            )}
            {!loading && posts.length <=0 && (
                <p className="text-gray-400">Your search query didn't match any posts</p>
            )}
            {showMore &&
                <div className="w-full self-center py-7 flex justify-center">
                    <Button onClick={handleShowMore} className="text-sm text-hl-purple">
                        Show More
                    </Button>
                </div>
            }
        </div>
    </div>
  )
}
