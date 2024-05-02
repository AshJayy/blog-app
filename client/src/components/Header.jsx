import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon} from 'react-icons/fa'
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
  const {currentUser} = useSelector(state => state.user);

  return (
    <Navbar className="border-b-2">

      <Logo
        textSixe = "text-sm sm:text-xl"
        imgWidth = "w-6 sm:w-8"
      />

      <form>
        <TextInput
        type="text"
        placeholder='Search...'
        rightIcon={AiOutlineSearch}
        className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color='gray' pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-4 md:order-2">

        <Button className="w-12 h-10 hidden sm:inline" color='gray' pill>
          <FaMoon />
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
              <Dropdown.Divider />
              <Dropdown.Item>Sign Out</Dropdown.Item>
            </Link>
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
