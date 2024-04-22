import { Button, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon} from 'react-icons/fa'
import logo from '../assets/logo/logo-small.svg'

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
  return (
    <Navbar className="border-b-2">

      <Link to='/' className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span>
          <img src={logo} className="self-center w-6 sm:w-8 object-cover inline"/>
        </span>
        <span className="px-1 sm:px-2 font-normal">Ash's</span>
        <span>Blog</span>
      </Link>

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

        <Link to='/sign-in'>
          <Button gradientDuoTone="pinkToOrange" outline>
            Sign In
          </Button>
        </Link>

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
