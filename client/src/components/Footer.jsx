import Logo from './Logo.jsx'
import {Footer} from 'flowbite-react'
import { BsInstagram, BsGithub, BsLinkedin, BsBehance } from "react-icons/bs";

export default function FooterComp() {
  return (
    <Footer container className='border-t-4 border-hl-purple rounded-none'>
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex sm-grid-cols-1">
                <div>
                    <Logo
                        textSize='text-lg sm:text-xl'
                        imgWidth = "w-8 sm:w-10"
                    />
                </div>
                <div className="grid grid-cols-2 gap-5 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                        <Footer.Title title="About" />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://blog.100jsprojects.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                100 JS Projects
                            </Footer.Link>
                            <Footer.Link
                                href='/about'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Ash's Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title="Follow Us" />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://github.com/AshJayy'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                GitHub
                            </Footer.Link>
                            <Footer.Link
                                href='https://www.linkedin.com/in/ashwinie-jayamanna-08a635190/'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                LinkedIn
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div className='mt-4 sm:mt-0'>
                        <Footer.Title title='Legal' />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='#'
                            >
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link
                                href='#'
                            >
                                Terms & Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider className='my-5' />
            <div className="w-full sm:flex sm:flex-row sm:justify-between sm:items-center">
                <div className="self-center">
                    <Footer.Copyright href='#' by="Ashwinie Jayamanna" year="2024" />
                </div>
                <div className='flex flex-row gap-4 mt-4 sm:mt-0'>
                    <Footer.Icon href='https://www.instagram.com/ash_jayyy/' icon={BsInstagram}/>
                    <Footer.Icon href='https://github.com/AshJayy' icon={BsGithub}/>
                    <Footer.Icon href='https://www.linkedin.com/in/ashwinie-jayamanna-08a635190/' icon={BsLinkedin}/>
                    <Footer.Icon href='https://www.behance.net/ashwinijayaman' icon={BsBehance}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}
