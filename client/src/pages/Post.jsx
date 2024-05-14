import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function UpdatePost() {

    const {postSlug} = useParams();
    const {currentUser} = useSelector(state => state.user);

    const navigate = useNavigate();

    const [post, setPost] = useState({
        title: '',
        category: 'uncategorized',
        image: '',
        content: '',
        date: null,
    });

    const [updateError, setUpdateError] = useState('');
    const [postUpdating, setPostUpdating] = useState(false);

    const [imgFile, setImgFile] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null)
    const [imgUploadError, setImgUploadError] = useState('');
    const [imgUploading, setImgUploading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
          const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
            setUpdateError('Could not get post data. ' + data.message);
            return;
          }
          if (res.ok && data.posts.length > 0) {
            setUpdateError(null);
            setPost({
                title: data.posts[0].title,
                category: data.posts[0].category,
                image: data.posts[0].image,
                content: data.posts[0].content,
                date: data.posts[0].createdAt
            });
            setImgFile(data.posts[0].image)
            console.log(data.posts[0]);
            console.log(post);
          }
        };
        try {
          fetchPost()
        } catch (error) {
          console.log('Error fetching Post' + error.message);
        }
      }, [postSlug]);

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
                        setPost({...post, image: downloadURL});
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
                body: JSON.stringify(post)
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
    // TODO: add loading
    <main className="p-3 max-w-3xl min-h-screen mx-auto flex flex-col">
        <h1 className="mt-10 mb-5 max-w-2xl text-center text-3xl lg:text-4xl font-serif mx-auto">{post && post.title}</h1>
        <Link to={`/search?category=${post && post.category}`} className="self-center">
            <Button color='gray' pill size='xs' className="w-fit">
                {post && post.category}
            </Button>
        </Link>
        <img
            src={post && post.image}
            alt={post && post.title}
            className="mt-8 p-3 max-g-[600px] w-full object-cover"
        />
        <div className="p-3 flex flex-row justify-between w-full mx-auto max-w-2xl text-gray-400 text-xs italic border-b-2 border-purple-500">
            <span>{post && new Date(post.date).toLocaleDateString()}</span>
            <span>{post && (post.content.length/1000).toFixed()} mins read</span>
        </div>
        <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html: post && post.content}}>
        </div>

    </main>
  )
}
