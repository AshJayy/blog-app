import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import CallToAction from '../components/CallToAction.jsx';
import RecentArticles from '../components/RecentArticles.jsx';

export default function Home() {
  return (
    <div>
      <div id="hero" className='flex flex-col sm:flex-row gap-8 items-center justify-center px-8 py-28 lg:px-28 lg:py-36'>
        <div className='flex flex-col w-full gap-6 max-w-2xl text-center sm:text-left'>
          <h1 className='text-3xl md:text-4xl lg:text-6xl font-bold'>Welcome to my Blog.</h1>
          <p className='text-gray-500 text-xs sm:text-sm'>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
          <Link to='/search' className='text-xs font-bold text-hl-purple hover:underline'>View all posts</Link>
        </div>

        <div className="flex justify-center w-full max-w-lg">
          <Logo
            textSize="text-2xl sm:text-4xl"
            imgWidth="w-12 sm:w-16"
          />
        </div>
      </div>
      <div id='cta' className='p-8 max-w-5xl mx-auto'>
        <CallToAction />
      </div>
      <div className='p-3 mb-5'>
        <RecentArticles limit={8} />
        <div className='w-full flex justify-center p-3'>
          <Link to='/search' className='text-xs font-bold text-hl-purple text-center hover:underline'>View all posts</Link>
        </div>
      </div>
    </div>
  )
}
