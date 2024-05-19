import { useEffect, useState } from "react"
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon, FaSun} from 'react-icons/fa'
import { useDispatch } from "react-redux"
import { signOutSuccess } from "../redux/User/userSlice";
import { toggleTheme } from "../redux/theme/theme.slice.js"
import { useSelector } from 'react-redux'
import Logo from './Logo.jsx'

export default function Header() {
  const navItems = [
    {
      name: "Home",
      path: "/",
      link: '/',
    },
    {
      name: "About",
      path: "/about",
      link: '/about',
    },
    {
      name: "Projects",
      path: "/projects",
      link: '/projects',
    }
  ]
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {currentUser} = useSelector(state => state.user);
  const {theme} = useSelector(state => state.theme);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const URLParams = new URLSearchParams(location.search);
    const searchTermFromURL = URLParams.get('searchTerm');
    if(searchTermFromURL){
      setSearchTerm(searchTermFromURL);
    }
  }, [location.search])

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
        navigate('/sign-in');
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSubmit= (e) => {
    e.preventDefault();
    const URLParams = new URLSearchParams(location.search);
    URLParams.set('searchTerm', searchTerm);
    const searchQuery = URLParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className="border-b-2">

      <Logo
        textSixe = "text-sm sm:text-xl"
        imgWidth = "w-6 sm:w-8"
      />

      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color='gray' pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-4 md:order-2">

        <Button
          className="w-12 h-10 hidden sm:inline" pill
          color='gray'
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? (
            <FaMoon />
          ) : (
            <FaSun />
          )}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={theme === 'light' ? FaMoon : FaSun} className="sm:hidden" onClick={() => dispatch(toggleTheme())}>Theme</Dropdown.Item>
          </Dropdown>
          ) : (
            <Link to='/sign-in'>
            <Button gradientDuoTone="pinkToOrange" outline>
              Sign In
            </Button>
          </Link>
        )}

        {/* Creates the hamburger on smaller screens */}
        <Navbar.Toggle />

      </div>

       {/* as={'div'} eliminates double a tags coming from Link and Navbar.Link */}
      <Navbar.Collapse>
       {navItems.map((item, index) => (
        <Navbar.Link key={index} active={path == item.path} as={'div'} className="md:hover:text-hl-pink md:text-bg-darkgray">
          <Link to={item.link}>{item.name}</Link>
        </Navbar.Link>
       ))}
      </Navbar.Collapse>

    </Navbar>
  )
}
