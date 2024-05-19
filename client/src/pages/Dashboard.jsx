import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashStats from "../components/DashStats";

export default function Dashboard() {

  const location = useLocation()
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  }, [location.search])

  return (
    <div id="dashboard" className="min-h-screen w-full flex flex-col sm:flex-row">
      <div>
        {/* Sidebar */}
        <DashSideBar />
      </div>
      <div className="w-full">
        {/* Profile */}
        {tab === 'profile' && <DashProfile />}
        {/* Posts */}
        {tab === 'posts' && <DashPosts />}
        {/* Users */}
        {tab === 'users' && <DashUsers />}
        {/* Comments */}
        {tab === 'comments' && <DashComments />}
        {/* Dashboard */}
        {tab === 'dashboard' && <DashStats />}
      </div>
    </div>
  )
}