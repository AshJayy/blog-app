import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, TableBody, Modal } from "flowbite-react";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import "tailwind-scrollbar";


export default function DashPosts() {

  const {currentUser} = useSelector(state => state.user)

  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)

  const [deletePostID, setDeletePostID] = useState('');
  const [showModal, setShowModal] = useState(false)

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
        if(data.posts.length < 9){
          setShowMore(false);
        }
      }else{
        console.log('Failed to fetch posts');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`api/post/getposts?userID=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setUserPosts((prev) => [...prev, ...data.posts]);
        if(data.posts.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`api/post/deletepost/${currentUser._id}/${deletePostID}`, {
        method: 'DELETE'
      });
      const data = res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setUserPosts((prev) => prev.filter((post) => post._id !== deletePostID));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    // TODO: fix overflow
    <div className="table-auto h-screen max-w-2xl md:mx-auto p-5 overflow-scroll scrollbar scrollbar-thumb-gray-400">
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
            <TableBody className="divide-y border-b-[1px] border-gray-200 dark:border-gray-700">
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
                      <span
                        className='text-lg text-red-400 hover:text-white cursor-pointer'
                        onClick={() => {
                          setShowModal(true)
                          setDeletePostID(post._id)
                        }}
                      >
                        <MdDelete />
                      </span>
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
          {showMore &&
            <Button onClick={handleShowMore} className="w-full self-center py-7 text-sm text-hl-purple">
              Show More
            </Button>
          }
        </div>
      ) : (
        <p>You have no posts yet.</p>
      )}

      {/* delete post modal */}
      <Modal
        show={showModal} onClose={() =>
        setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center mb-8">
            <HiOutlineExclamationCircle className='mx-auto mb-3 w-8 h-8 text-red-400' />
            <span className='inline-block font-medium text-gray-600'>
              Are you sure you want to delete this Post?
            </span>
          </div>
          <div className="flex flex-row justify-center gap-4">
            <Button
              color={'failure'}
              onClick={handleDeletePost}
            >
              Yes, I'm sure
            </Button>
            <Button
              color='gray'
              onClick={() => setShowModal(false)}
            >
              No, Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}
