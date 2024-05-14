import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, TableBody, Modal } from "flowbite-react";
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle, HiOutlineX, HiOutlineCheck } from "react-icons/hi";
import "tailwind-scrollbar";


export default function DashPosts() {

  const {currentUser} = useSelector(state => state.user)

  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)

  const [deleteUserID, setDeleteUserID] = useState('');
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if(currentUser  && currentUser.isAdmin){
      fetchPosts();
    }
  }, [currentUser._id, currentUser?._id])

  const fetchPosts = async () => {
    try {
      const res = await fetch(`api/user/getusers`)
      const data = await res.json();
      if(res.ok){
        setUsers(data.users);
        if(data.users.length < 10){
          setShowMore(false);
        }
      }else{
        console.log('Failed to fetch users');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`api/user/getusers?startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setUsers((prev) => [...prev, ...data.users]);
        if(data.users.length < 9){
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`api/user/delete/${deleteUserID}`, {
        method: 'DELETE'
      });
      const data = res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setUsers((prev) => prev.filter((user) => user._id !== deleteUserID));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    // TODO: fix overflow
    <div className="table-auto h-screen max-w-2xl md:mx-auto p-5 overflow-scroll scrollbar scrollbar-thumb-gray-400">
      {currentUser.isAdmin && users.length > 0 ? (
        <div id="users">
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Profile Picture</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell><span>Delete</span></Table.HeadCell>
            </Table.Head>
            <TableBody className="divide-y border-b-[1px] border-gray-200 dark:border-gray-700">
              {users.map((user, index) => (
                <Table.Row className='border-[1px] border-gray-200 dark:border-gray-700' key={index}>
                    <Table.Cell>
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/user/${user._id}`}>
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-10 h-10 object-cover rounded-full border-gray-400 border-2"
                          />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/user/${user._id}`} className=' font-semibold text-gray-600 dark:text-gray-300'>{user.username}</Link>
                    </Table.Cell>
                    <Table.Cell>
                      {user.email}
                    </Table.Cell>
                    <Table.Cell>
                        <span className='text-lg text-red-400 '>
                            {user.isAdmin ? (
                                <HiOutlineCheck />
                            ) : (
                                <HiOutlineX />
                            )}
                        </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className='text-lg text-red-400 hover:text-white cursor-pointer'
                        onClick={() => {
                          setShowModal(true)
                          setDeleteUserID(user._id)
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
        <p>No users.</p>
      )}

      {/* delete user modal */}
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
              onClick={handleDeleteUser}
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
