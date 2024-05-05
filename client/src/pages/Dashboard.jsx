import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../components/DashSideBar";
import DashProfile from "../components/DashProfile";

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
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div>
        {/* Sidebar */}
        <DashSideBar />
      </div>
      <div>
        {/* Profile */}
        {tab === 'profile' && <DashProfile />}
      </div>
    </div>
  )
}