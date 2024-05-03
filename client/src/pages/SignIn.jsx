import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/User/userSlice';
import Logo from '../components/Logo.jsx';
import OAuth from '../components/OAuth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error: errorMessage} = useSelector(state => state.user)

  const dispatch = useDispatch();
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
      return dispatch(signInFailure('Please fill out all fields.'))
    }

    try {
      dispatch(signInStart());

      const res = await fetch('api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if(data.success == false){
        return dispatch(signInFailure(data.message));
      }

      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/')
      }

    } catch (error) {
      dispatch(signInFailure(data.message));
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

            <OAuth />
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an account?</span>
            <Link to='/sign-up' className="text-hl-purple">
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
