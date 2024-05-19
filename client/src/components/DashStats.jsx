import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiArrowUp, HiDocumentText } from "react-icons/hi";
import { FaComment, FaUsers } from "react-icons/fa";
import { Button, Table, Spinner } from "flowbite-react";

export default function DashStats() {

    const {currentUser} = useSelector(state => state.user)

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);

    const [loading, setLoading] = useState({
        users: false,
        comments: false,
        posts: false,
    });


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading({...loading, users: true});
            try {
                const res = await fetch(`api/user/getusers?limit=5`)
                const data = await res.json();
                if(res.ok){
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                    setLoading({...loading, users: false});
                }else{
                    console.log('Failed to fetch users');
                    setLoading({...loading, users: false});
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        const fetchComments = async () => {
            setLoading({...loading, comments: true});
            try {
                const res = await fetch(`api/comment/getallcomments?limit=5`)
                const data = await res.json();
                if(res.ok){
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                    setLoading({...loading, comments: false});
                }else{
                    console.log('Failed to fetch comments');
                    setLoading({...loading, comments: false});
                }
            } catch (error) {
                console.log(error.message);
            }
        }

        const fetchPosts = async () => {
            setLoading({...loading, posts: true});
            try {
                const res = await fetch(`api/post/getposts?limit=5`)
                const data = await res.json();
                if(res.ok){
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                    setLoading({...loading, posts: false});
                }else{
                    console.log('Failed to fetch posts');
                    setLoading({...loading, posts: false});
                }
            } catch (error) {
                console.log(error.message);
            }
          }

        if(currentUser  && currentUser.isAdmin){
            fetchUsers();
            fetchComments();
            fetchPosts();
        }
      }, [currentUser._id, currentUser?._id])


  return (
    <div className="flex flex-col gap-8 items-center p-3 mt-5 w-full mx-auto h-screen overflow-y-scroll scrollbar scrollbar-thumb-gray-400">
      <div id="stats" className="flex flex-wrap gap-4 justify-center">
        <div id="stats-users" className="flex justify-between p-4 dark:bg-gray-800 gap-4 w-full sm:w-72 rounded-md shadow-md">
            <div>
                <h3 className="text-gray-400 text-md uppercase">Total Users</h3>
                <p className="text-2xl">{totalUsers}</p>
                <div className="flex gap-2 justify-start mt-5 text-sm ">
                    <span className="flex gap-1 items-center text-hl-orange font-medium">
                        <HiArrowUp />
                        {lastMonthUsers}
                    </span>
                    <span className="text-gray-400">last month</span>
                </div>
            </div>
            <FaUsers className="bg-purple-500 h-10 w-10 rounded-full p-2" />
        </div>
        <div id="stats-comments" className="flex justify-between p-4 dark:bg-gray-800 gap-4 w-full sm:w-72 rounded-md shadow-md">
            <div>
                <h3 className="text-gray-400 text-md uppercase">Total Comments</h3>
                <p className="text-2xl">{totalComments}</p>
                <div className="flex gap-2 justify-start mt-5 text-sm ">
                    <span className="flex gap-1 items-center text-hl-orange font-medium">
                        <HiArrowUp />
                        {lastMonthComments}
                    </span>
                    <span className="text-gray-400">last month</span>
                </div>
            </div>
            <FaComment className="bg-orange-500 h-10 w-10 rounded-full p-2" />
        </div>
        <div id="stats-posts" className="flex justify-between p-4 dark:bg-gray-800 gap-4 w-full sm:w-72 rounded-md shadow-md">
            <div>
                <h3 className="text-gray-400 text-md uppercase">Total Posts</h3>
                <p className="text-2xl">{totalPosts}</p>
                <div className="flex gap-2 justify-start mt-5 text-sm ">
                    <span className="flex gap-1 items-center text-hl-orange font-medium">
                        <HiArrowUp />
                        {lastMonthPosts}
                    </span>
                    <span className="text-gray-400">last month</span>
                </div>
            </div>
            < HiDocumentText className="bg-pink-500 h-10 w-10 rounded-full p-2" />
        </div>
      </div>
      <div id="data" className="flex flex-wrap gap-2 p-3 max-w-3xl">
        <div id="data-users" className="flex flex-col gap-3 w-full md:w-auto p-3 flex-1 shadow-md dark:shadow-none rounded-md">
            <div className="flex px-3 w-full justify-between items-center">
                <h1 className="text-md font-medium">Recent Users</h1>
                <Button gradientDuoTone="pinkToOrange" outline>
                    <Link to={'/dashboard?tab=users'}>
                        See all
                    </Link>
                </Button>
            </div>
            {loading.users ? (
                <Spinner className="w-10 h-10 mt-64" />
            ) : (
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Profile Picture</Table.HeadCell>
                        <Table.HeadCell>Username</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {users.map((user) => (
                            <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>
                                    <img
                                        src={user.profilePicture}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                        />
                                </Table.Cell>
                                <Table.Cell>
                                    {user.username}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </div>
        <div id="data-comments" className="flex flex-col gap-3 w-full md:w-auto p-3 flex-1 dark:shadow-none shadow-md  rounded-md">
            <div className="flex px-3 w-full justify-between items-center">
                <h1 className="text-md font-medium">Recent Comments</h1>
                <Button gradientDuoTone="pinkToOrange" outline>
                <Link to={'/dashboard?tab=comments'}>
                        See all
                    </Link>
                </Button>
            </div>
            {loading.comments ? (
                <Spinner className="w-10 h-10 mt-64" />
            ) : (
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Comment</Table.HeadCell>
                        <Table.HeadCell>Likes</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {comments.map((comment) => (
                            <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell >
                                    <p className="line-clamp-3">{comment.content}</p>
                                </Table.Cell>
                                <Table.Cell>
                                    {comment.numberOfLikes}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </div>
        <div id="data-posts" className="flex flex-col gap-3 w-full md:w-auto p-3 flex-1 dark:shadow-none shadow-md  rounded-md">
            <div className="flex px-3 w-full justify-between items-center">
                <h1 className="text-lg font-medium">Recent Posts</h1>
                <Button gradientDuoTone="pinkToOrange" outline>
                <Link to={'/dashboard?tab=posts'}>
                        See all
                    </Link>
                </Button>
            </div>
                {loading.posts ? (
                    <Spinner className="w-10 h-10 mt-64" />
                ) : (
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Image</Table.HeadCell>
                        <Table.HeadCell>Title</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {posts.map((post) => (
                            <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell >
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className=" w-16 h-10 object-cover rounded-md"
                                        />
                                </Table.Cell>
                                <Table.Cell className="font-medium">
                                    {post.title}
                                </Table.Cell>
                                <Table.Cell>
                                    {post.category}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </div>
      </div>
    </div>
  )
}
