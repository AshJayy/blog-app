import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Alert, Button, FileInput, Label, Select, TextInput, ToggleSwitch } from "flowbite-react";
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {

    const navigate = useNavigate();
    const currentFullDate = new Date();
    const currentDate = new Date().toISOString().split('T')[0]
    const nextWeek = new Date(currentFullDate.getFullYear(), currentFullDate.getMonth(), currentFullDate.getDate() + 8).toISOString().split('T')[0];
    const [minEndDate, setMinEndDate] = useState(nextWeek);

    const [formData, setFormData] = useState({
        title: '',
        category: 'general',
        imageOnly: true,
        image: '',
        startDate: currentDate,
        endDate: nextWeek,
    });
    console.log(formData);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [publishError, setPublishError] = useState(null);

    const [imgFile, setImgFile] = useState('https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg');
    const [imgUploadProgress, setImgUploadProgress] = useState(null)
    const [imgUploadError, setImgUploadError] = useState('');
    const [imgUploading, setImgUploading] = useState(false);

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
        setPublishError(null);
        setPublishSuccess(false);

        try {
            const res = await fetch('api/ad/create', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if(!res.ok){
                setPublishError(data.message)
            }else{
                setPublishSuccess(true);
                setPublishError(null);
                navigate(`/dashboard?tab=ads`)
            }
        } catch (error) {
            setPublishError('Something went wrong.')
            setPublishSuccess(false);
        }
    }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-2xl my-8 font-semibold">Create a post</h1>
        <form className="flex flex-col gap-4 mb-4" onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <TextInput
                    id="title"
                    type="text"
                    placeholder="Title"
                    required
                    className="flex-1"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <Select
                    id="category"
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                    <option value='all'>Select a category</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                </Select>
            </div>
            <TextInput
                id="targetURL"
                type="text"
                placeholder="URL"
                required
                onChange={(e) => setFormData({...formData, targetURL: e.target.value})}
                value={formData.targetURL}

            />
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
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col w-full">
                    <Label className="px-3 pb-1">Start Date</Label>
                    <TextInput
                        id="startDate"
                        type="date"
                        min={currentDate}
                        onChange={(e) => {
                            const startDateFull = new Date(e.target.value);
                            const newEndDate = new Date(startDateFull.getFullYear(), startDateFull.getMonth(), startDateFull.getDate() + 8).toISOString().split('T')[0];
                            setMinEndDate(newEndDate);
                            setFormData({...formData, startDate: e.target.value, endDate: newEndDate});
                        }}
                        value={formData.startDate}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <Label className="px-3 pb-1">End Date</Label>
                    <TextInput
                        id="endDate"
                        type="date"
                        min={minEndDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        value={formData.endDate}
                    />
                </div>
                <div className="flex flex-col w-fit items-center">
                <Label htmlFor="imageOnly" className="pb-1 text-nowrap">Image Only
                        <input
                            type="checkbox"
                            id="imageOnly"
                            className="sr-only peer"
                            checked={formData.imageOnly}
                            onChange={() => setFormData({...formData, imageOnly: !formData.imageOnly})}
                        />
                        <div id="check" className="relative w-11 h-6 m-3 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-hl-purple"></div>
                    </Label>
                </div>
            </div>
            <h3>Preview</h3>
            <div className="flex flex-col items-center justify-center my-8">
                <p className="text-xs text-gray-500">Advertisement</p>
                <Link to={formData.targetURL} target="_blank" className="border-[1px] border-gray-300 dark:border-gray-700">
                    {formData.imageOnly ? (
                            <img
                                src={imgFile}
                                alt={"title"}
                                className=" max-h-80"
                            />
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 bg-gray-200">
                            <div className="flex-1 flex flex-col gap-3 justify-around p-8 w-fit mx-auto text-center">
                                <h1 className="text-xl font-medium text-gray-800">{formData.title}</h1>
                            </div>
                            <div className="flex-1 p-3 w-full">
                                <img src={formData.image} className=" min-w-96" />
                            </div>
                        </div>
                    )
                    }
                </Link>
                <p className="text-xs text-gray-500">Advertisement</p>
            </div>
            <Button
                type="submit"
                gradientDuoTone="pinkToOrange"
                required
            >
                Create
            </Button>
        </form>
        {publishError &&
            <Alert color='failure'>
                {publishError}
            </Alert>
        }
        {publishSuccess &&
            <Alert color='success'>
                Published successfully.
            </Alert>
        }
    </div>
  )
}
