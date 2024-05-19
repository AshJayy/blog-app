import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, TableBody, Modal } from "flowbite-react";
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle, HiOutlineX, HiOutlineCheck } from "react-icons/hi";
import "tailwind-scrollbar";


export default function DashComments() {

  const {currentUser} = useSelector(state => state.user)

  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)

  const [deleteCommentID, setDeleteCommentID] = useState('');
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if(currentUser  && currentUser.isAdmin){
      fetchComments();
    }
  }, [currentUser._id, currentUser?._id])

  const fetchComments = async () => {
    try {
      const res = await fetch(`api/comment/getallcomments`)
      const data = await res.json();
      if(res.ok){
        setComments(data.comments);
        if(comments.length <= 9){
          setShowMore(false);
        }
      }else{
        console.log('Failed to fetch comments');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`api/comment/getallcomments?startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setComments((prev) => [...prev, ...data.comments]);
        if(comments.length < 10){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false)
      try {
        if(!currentUser){
          navigate('/sign-in');
          return;
        }
        const res = await fetch(`/api/comment/deletecomment/${deleteCommentID}`, {
          method: 'DELETE'
        });
        if(res.ok) {
          const data = await res.json();
          setComments(comments.filter((comment) => deleteCommentID !== comment._id));
        }
      } catch (error) {
        console.log(error.message);
      }
  }

  return (
    <div className="table-auto h-screen sm:min-w-4xl sm:max-w-5xl md:mx-auto p-5 overflow-scroll scrollbar scrollbar-thumb-gray-400">
      {currentUser.isAdmin && comments.length > 0 ? (
        <div id="comments">
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>user ID</Table.HeadCell>
              <Table.HeadCell>No Of Likes</Table.HeadCell>
              <Table.HeadCell>Post ID</Table.HeadCell>
              <Table.HeadCell><span>Delete</span></Table.HeadCell>
            </Table.Head>
            <TableBody className="divide-y border-b-[1px] border-gray-200 dark:border-gray-700">
              {comments.map((comment, index) => (
                <Table.Row className='border-[1px] border-gray-200 dark:border-gray-700' key={index}>
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="min-w-48 font-medium text-white">
                        <p className="line-clamp-3">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell className="min-w-32">
                        <span>
                          {comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")}
                        </span>
                    </Table.Cell>
                    <Table.Cell className="text-xs">
                      {comment.userID}
                    </Table.Cell>
                    <Table.Cell className="text-xs">
                      {comment.postID}
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className='text-lg text-red-400 hover:text-gray-700 dark:hover:text-white cursor-pointer'
                        onClick={() => {
                          setShowModal(true)
                          setDeleteCommentID(comment._id)
                        }}
                      >
                        <MdDelete />
                      </span>
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
        <p>No comments.</p>
      )}

      {/* delete comment modal */}
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
              onClick={handleDeleteComment}
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
