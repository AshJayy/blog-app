import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function UpdatePost() {

    const {postID} = useParams();
    const {currentUser} = useSelector(state => state.user);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: 'uncategorized',
        image: '',
        content: ''
    });

    const [updateError, setUpdateError] = useState('');
    const [postUpdating, setPostUpdating] = useState(false);

    const [imgFile, setImgFile] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null)
    const [imgUploadError, setImgUploadError] = useState('');
    const [imgUploading, setImgUploading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
          const res = await fetch(`/api/post/getposts?postID=${postID}`);
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            setUpdateError('Could not get post data. ' + data.message);
            return;
          }
          if (res.ok && data.posts.length > 0) {
            setUpdateError(null);
            setFormData({
                title: data.posts[0].title,
                category: data.posts[0].category,
                image: data.posts[0].image,
                content: data.posts[0].content
            });
            setImgFile(data.posts[0].image)
        }
        console.log(data.posts[0]);
        console.log(formData);
        };
        try {
          fetchPost()
        } catch (error) {
          console.log('Error fetching Post' + error.message);
        }
      }, [postID]);

    const uploadImage = async () => {
        try {
            if(!imgFile){
                return setImgUploadError('Please select an image')
            }

            setImgUploadError(null);
            setImgUploading(true);


            const storage = getStorage(app);
            const fileName = new Date().getTime() + imgFile.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imgFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImgUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImgUploadError('Could not upload image (File must be an image and should be less than 2MB)');
                    setImgUploadProgress(null);
                    setImgFile(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImgFile(downloadURL);
                        setFormData({...formData, image: downloadURL});
                        setImgUploadProgress(null);
                        setImgUploadError(null);
                        setImgUploading(false);
                    });
                }
            );

        } catch (error) {
            setImgUploadError('Failed to upload image.');
            setImgUploadProgress(null);
            setImgFile(null);
            setImgUploading(false);
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateError(null);
        setPostUpdating(true)

        try {
            const res = await fetch(`/api/post/updatepost/${currentUser._id}/${postID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if(!res.ok){
                setUpdateError(data.message);
                setPostUpdating(false);

            }else{
                setPostUpdating(false);
                setUpdateError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPostUpdating(false);
            setUpdateError('Something went wrong.')
        }
    }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-2xl my-8 font-semibold">Update post</h1>
        <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <TextInput
                    id="title"
                    type="text"
                    placeholder="Title"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    value={formData.title}
                />
                <Select
                    id="category"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    value={formData.category}
                >
                    <option value='uncategorized'>Select a category</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                </Select>
            </div>
            <div className="flex gap-4 justify-between items-center p-3 border-2 border-hl-purple border-dotted">
                <FileInput
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImgFile(e.target.files[0])}
                />
                <Button
                    type="button"
                    gradientDuoTone="pinkToOrange"
                    outline
                    size="sm"
                    onClick={uploadImage}
                    disabled={imgUploading}
                >
                    {imgUploading ? (
                        `Uploading... ${imgUploadProgress}%`
                    ) : (
                        'Upload Image'
                    )}
                </Button>
            </div>
            {imgUploadError &&
                <Alert color='failure'>
                    {imgUploadError}
                </Alert>
            }
            {imgFile &&
                <img
                    src={formData.image}
                    alt="cover"
                    className="w-full h-72 object-cover"
                />
            }
            <ReactQuill
                theme="snow"
                placeholder="Add your content"
                className="h-72 mb-12"
                onChange={(value) => {setFormData({...formData, content: value})}}
                value={formData.content}
            />
            <Button
                type="submit"
                gradientDuoTone="pinkToOrange"
                required
            >
                {postUpdating ? (
                        <Spinner />
                    ) : (
                        'Update'
                    )}
            </Button>
        </form>

        {updateError &&
            <Alert color='failure'>
                {updateError}
            </Alert>
        }

    </div>
  )
}
