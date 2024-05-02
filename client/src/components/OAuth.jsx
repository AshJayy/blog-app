import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/User/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: 'select_account'})
        try {
            const googleResults = await signInWithPopup(auth, provider);
            console.log(googleResults);

            const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  name: googleResults.user.displayName,
                  email: googleResults.user.email,
                  googlePhotoURL: googleResults.user.photoURL,
              }),
            });

            const data = await res.json();

            if(res.ok){
              dispatch(signInSuccess(data))
              navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <Button gradientDuoTone="redToYellow" outline onClick={handleGoogleSignIn}>
      <AiFillGoogleCircle className='w-6 h-6 mr-3' />
      Continue with Google
    </Button>
  )
}
