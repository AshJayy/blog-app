import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { Button, Label, TextInput } from 'flowbite-react';

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className='flex flex-col md:flex-row gap-6 p-3 max-w-3xl mx-auto md:items-center'>
        {/* left */}
        <div className="flex-1">
          <Logo
            textSize="text-4xl"
            imgWidth="w-16"
          />
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password or with Google.
          </p>
        </div>

        {/* right */}
        <dev className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value='Your username' />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
              />
            </div>
            <div>
              <Label value='Your Email' />
              <TextInput
                type='text'
                placeholder='name@example.com'
                id='email'
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='text'
                placeholder='Password'
                id='password'
              />
            </div>
            <Button gradientDuoTone='pinkToOrange' type='submit'>
              Sign Up
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className="text-hl-purple">
              Sign In
            </Link>
          </div>
        </dev>
      </div>
    </div>
  );
}
