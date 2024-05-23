import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, TableBody, Modal } from "flowbite-react";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiOutlineExclamationCircle, HiOutlineCheck, HiOutlineX } from "react-icons/hi";
import "tailwind-scrollbar";


export default function DashAds() {

  const {currentUser} = useSelector(state => state.user)

  const [ads, setAds] = useState([])
  const [showMore, setShowMore] = useState(true)

  const [deleteAdID, serDeleteAdID] = useState('');
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if(currentUser  && currentUser.isAdmin){
      fetchPosts();
    }
  }, [currentUser._id, currentUser?._id])

  const fetchPosts = async () => {
    try {
      const res = await fetch(`api/ad/getads`)
      const data = await res.json();
      if(res.ok){
        setAds(data.ads);
        if(data.ads.length < 9){
          setShowMore(false);
        }
      }else{
        console.log('Failed to fetch ads');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = ads.length;
    try {
      const res = await fetch(`api/ad/getads&startIndex=${startIndex}`)
      const data = await res.json();
      if(res.ok){
        setAds((prev) => [...prev, ...data.ads]);
        if(data.ads.length < 9){
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
      const res = await fetch(`api/ad/delete/${currentUser._id}/${deleteAdID}`, {
        method: 'DELETE'
      });
      const data = res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setAds((prev) => prev.filter((ad) => ad._id !== deleteAdID));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const toggleActive = async (adID, isActive) => {
    try {
        const res = await fetch(`api/ad/toggleactive/${currentUser._id}/${adID}`, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({isActive: !isActive})
        });
        if (!res.ok) {
            console.log(`Error updating active status of ad ${adID}`);
            return;
        }

        const data = await res.json();
        console.log(data);

        setAds(ads.map(ad => {
            if (ad._id === adID) {
                return { ...ad, isActive: !isActive };
            }
            return ad;
        }));
    } catch (error) {
        console.log(error.message);
    }
  }

  return (
    <div className="table-auto h-screen max-w-4xl md:mx-auto p-5 overflow-scroll scrollbar scrollbar-thumb-gray-400">
      {currentUser.isAdmin && ads.length > 0 ? (
        <div id="ads">
          <Table hoverable className="shadow-md text-xs">
            <Table.Head>
              <Table.HeadCell>Period</Table.HeadCell>
              <Table.HeadCell>Thumbnail</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Active</Table.HeadCell>
              <Table.HeadCell>Updated At</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            <TableBody className="divide-y border-b-[1px] border-gray-200 dark:border-gray-700">
              {ads.map((ad, index) => (
                <Table.Row className='border-[1px] border-gray-200 dark:border-gray-700' key={index}>
                    <Table.Cell className="w-fit max-w-28">
                      {(new Date(ad.startDate).toLocaleDateString()) + ' - ' + new Date(ad.endDate).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                        <img
                          src={ad.image}
                          alt={ad.title}
                          className="w-20 h-10 object-cover"
                          />
                    </Table.Cell>
                    <Table.Cell>
                        {ad.title}
                    </Table.Cell>
                    <Table.Cell>
                        <span className='text-lg text-red-400 cursor-pointer' onClick={() => toggleActive(ad._id, ad.isActive)}>
                            {ad.isActive ? (
                                <HiOutlineCheck />
                            ) : (
                                <HiOutlineX />
                            )}
                        </span>
                    </Table.Cell>
                    <Table.Cell className="max-w-24">
                        {new Date(ad.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {ad.category}
                    </Table.Cell>
                    <Table.Cell className="max-w-10">
                      <span
                        className='text-lg text-red-400 hover:text-gray-700 dark:hover:text-white cursor-pointer'
                        onClick={() => {
                          setShowModal(true)
                          serDeleteAdID(ad._id)
                        }}
                      >
                        <MdDelete />
                      </span>
                    </Table.Cell>
                    <Table.Cell className="max-w-10">
                      <Link to={`/update-ad/${ad._id}`}>
                        <span className='text-lg text-blue-500 hover:text-gray-700 dark:hover:text-white cursor-pointer'><MdEdit /></span>
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
        <p>You have no ads yet.</p>
      )}

      {/* delete ad modal */}
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
