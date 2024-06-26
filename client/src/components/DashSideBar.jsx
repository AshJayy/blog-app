import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { signOutSuccess } from "../redux/User/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux'
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser, HiDocumentText } from "react-icons/hi";
import { FaComment, FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GoSidebarCollapse } from "react-icons/go";
import { RiAdvertisementFill } from "react-icons/ri";

export default function DashSideBar() {

  const {currentUser} = useSelector(state => state.user)
  const dispatch = useDispatch();

  const location = useLocation()
  const [tab, setTab] = useState('');
  useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if(tabFromUrl){
      setTab(tabFromUrl)
      }
  }, [location.search])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch('api/user/signout', {
        method: 'POST'
      });
      const data = await res.json();

      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signOutSuccess());
        navigate('/');
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <div className={`w-screen sm:w-56  text-right sm:hidden bg-gray-50 dark:bg-gray-800
        transition-transform ${
          isSidebarOpen ? '' : '-translate-x-[85%] sm:translate-x-0 rounded-lg'
        }`
      }>
        <button type="button"
          onClick={toggleSidebar}
          className='p-2 rounded-lg focus:outline-none text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <GoSidebarCollapse className="w-6 h-6 inline"/>
        </button>
      </div>
      <div id="default-sidebar"
        className={`left-0 h-screen transition-transform ${
          isSidebarOpen ? '' : '-translate-x-full sm:translate-x-0 sm:block hidden'
        }`}
        aria-label="Sidebar">
        <Sidebar className='w-screen sm:w-56 rounded-none'>
          <Sidebar.Items>
            <Sidebar.ItemGroup className="flex flex-col gap-1">
                  {currentUser.isAdmin &&
                    <Link to='/dashboard?tab=dashboard' >
                      <Sidebar.Item
                        active={tab === 'dashboard'}
                        icon={MdDashboard }
                        as='div'
                      >
                          Dashboard
                      </Sidebar.Item>
                    </Link>
                  }
                <Link to='/dashboard?tab=profile' >
                    <Sidebar.Item
                      active={tab === 'profile'}
                      icon={HiUser}
                      label={currentUser.isAdmin ? "Admin" : "User"}
                      labelColor='dark'
                      as='div'
                    >
                        Profile
                    </Sidebar.Item>
                </Link>
                {currentUser.isAdmin &&
                  <Link to='/dashboard?tab=posts' >
                    <Sidebar.Item
                      active={tab === 'posts'}
                      icon={HiDocumentText}
                      as='div'
                    >
                        Posts
                    </Sidebar.Item>
                  </Link>
                }
                {currentUser.isAdmin &&
                  <Link to='/dashboard?tab=comments' >
                    <Sidebar.Item
                      active={tab === 'comments'}
                      icon={FaComment}
                      as='div'
                    >
                        Comments
                    </Sidebar.Item>
                  </Link>
                }
                {currentUser.isAdmin &&
                  <Link to='/dashboard?tab=ads' >
                    <Sidebar.Item
                      active={tab === 'ads'}
                      icon={RiAdvertisementFill}
                      as='div'
                    >
                        Advertisements
                    </Sidebar.Item>
                  </Link>
                }
                {currentUser.isAdmin &&
                  <Link to='/dashboard?tab=users' >
                    <Sidebar.Item
                      active={tab === 'users'}
                      icon={FaUsers}
                      as='div'
                    >
                        Users
                    </Sidebar.Item>
                  </Link>
                }
                <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </div>
  )
}
