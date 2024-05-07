import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-2xl my-8 font-semibold">Create a post</h1>
        <form className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <TextInput
                    id="title"
                    type="text"
                    placeholder="Title"
                    required
                    className="flex-1"
                />
                <Select>
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
                />
                <Button type="button" gradientDuoTone="pinkToOrange" outline size="sm">Upload Image</Button>
            </div>
            <ReactQuill theme="snow" placeholder="Add your content" className="h-72 mb-12" />
            <Button
                type="submit"
                gradientDuoTone="pinkToOrange"
                required
            >
                Publish
            </Button>
        </form>
    </div>
  )
}
