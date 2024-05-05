import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import { Alert, Button, TextInput } from "flowbite-react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {

  const {currentUser} = useSelector(state => state.user);

  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [imgFileURL, setImgFileURL] = useState(null);
  const [imgUploadProgress, setImgUploadProgress] = useState(null);
  const [imgUploadError, setImgUploadError] = useState('');
  const fileRef = useRef();

  console.log(imgUploadProgress, imgUploadError);

  const handleImageUpdate = (e) => {
    const file = e.target.files[0];
    if(file){
      setNewProfilePicture(file);
      setImgFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if(newProfilePicture) {
      uploadImage();
    }
  }, [newProfilePicture]);

  const uploadImage = async () => {

    setImgUploadError(null);

    // ----FIREBASE RULES-----
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + newProfilePicture.name;
    const storageRef = ref(storage, fileName);
    const uploadTask= uploadBytesResumable(storageRef, newProfilePicture);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgUploadProgress(progress.toFixed(0))
      },
      (error) => {
        setImgUploadError('Could not upload image (File must be less than 2MB)');
        setImgFileURL(null);
        setNewProfilePicture(null);
        setImgUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileURL(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto py-3 px-8 sm:px-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpdate}
          ref={fileRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden transition-transform hover:scale-105"
          onClick={() => fileRef.current.click()}
        >
          <img src={imgFileURL || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-4 border-gray-300 dark:border-gray-700 ${
              imgUploadProgress && imgUploadProgress < 100 && 'opacity-50'
            }`}
          />
          {imgUploadProgress > 0 &&
            <CircularProgressbar
              value={imgUploadProgress || 0}
              text={`${imgUploadProgress}%`}
              strokeWidth={3}
              styles={{
                root:{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(135, 43, 151, ${imgUploadProgress / 100})`
                },
                text: {
                  fill: '#872b97',
                }
              }}
            />
          }
        </div>
        {imgUploadError &&
          <Alert color='failure'>
            {imgUploadError}
          </Alert>
        }
        <TextInput
          className="rounded-lg hover:border-[1px] dark:hover:border-gray-400"
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          autoComplete="new-username"
        />
        <TextInput
          className="rounded-lg hover:border-[1px] dark:hover:border-gray-400"
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          autoComplete="new-email"
        />
        <TextInput
          className="rounded-lg hover:border-[1px] dark:hover:border-gray-400"
          type="password"
          id="password"
          placeholder="Password"
          autoComplete="new-password"
        />
        <Button type="submit" gradientDuoTone="pinkToOrange">
          Update
        </Button>
      </form>
      <div className='flex justify-between mt-3 px-2 text-red-500'>
        <span className='cursor-pointer  hover:text-red-400'>Delete Account</span>
        <span className='cursor-pointer  hover:text-red-400'>Sign Out</span>
      </div>
    </div>
  )
}
