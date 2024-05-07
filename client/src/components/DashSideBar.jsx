import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { signOutSuccess } from "../redux/User/userSlice";
import { useDispatch } from "react-redux";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { GoSidebarCollapse } from "react-icons/go";

export default function DashSideBar() {

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
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile' >
                    <Sidebar.Item
                      active={tab === 'profile'}
                      icon={HiUser}
                      label={"User"}
                      labelColor='dark'
                      as='div'
                    >
                        Profile
                    </Sidebar.Item>
                </Link>
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
