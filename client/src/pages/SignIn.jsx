import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value.trim()
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.email || !formData.password){
      return setErrorMessage('Please fill out all fields');
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if(data.success == false){
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if(res.ok){
        navigate('/')
      }

    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mt-20">
      <div className='flex flex-col md:flex-row gap-6 p-3 max-w-3xl mx-auto md:items-center'>

        <div className="flex-1">
          <Logo
            textSize="text-4xl"
            imgWidth="w-16"
          />
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password.
          </p>
        </div>

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <div>
              <Label value='Your Email' />
              <TextInput
                type='email'
                placeholder='name@example.com'
                id='email'
                onChange = {handleChange}
              />
            </div>
            <div>
              <Label value='Your Password' />
              <TextInput
                type='password'
                placeholder='********'
                id='password'
                onChange = {handleChange}
              />
            </div>

            <Button
              gradientDuoTone='pinkToOrange'
              type='submit'
              disabled={loading}
            >
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/sign-uo' className="text-hl-purple">
              Sign Up
            </Link>
          </div>

          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }

        </div>
      </div>
    </div>
  );
}
