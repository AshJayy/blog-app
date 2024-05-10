import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Table, TableBody } from "flowbite-react";
import { MdDelete, MdEdit } from "react-icons/md";
import "tailwind-scrollbar";


export default function DashPosts() {

  const {currentUser} = useSelector(state => state.user)

  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    if(currentUser  && currentUser.isAdmin){
      fetchPosts();
    }
  }, [currentUser._id, currentUser?._id])

  const fetchPosts = async () => {
    try {
      const res = await fetch(`api/post/getposts?userID=${currentUser._id}`)
      const data = await res.json();
      if(res.ok){
        setUserPosts(data.posts);
      }else{
        console.log('Failed to fetch posts');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    // TODO: fix overflow
    <div className="table-auto h-full md:mx-auto p-3 overflow-x-scroll scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-700">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div id="posts">
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Thumbnail</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            <TableBody className="divide-y">
              {userPosts.map((post, index) => (
                <Table.Row className='border-[1px] border-gray-200 dark:border-gray-700' key={index}>
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-30 h-10 object-cover"
                          />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`} className=' font-semibold text-gray-600 dark:text-gray-300'>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      {post.category}
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-lg text-red-400 hover:text-white cursor-pointer'><MdDelete /></span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`update-post/${post._id}`}>
                        <span className='text-lg text-blue-500 hover:text-white cursor-pointer'><MdEdit /></span>
                      </Link>
                    </Table.Cell>
                </Table.Row>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}
    </div>
  )
}
