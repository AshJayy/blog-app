import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Modal, Spinner, Textarea } from "flowbite-react";

export default function Comments(props) {
    const {currentUser} = useSelector(state => state.user)
    const postID = props.postID;

    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
      console.log('submitted');
        e.preventDefault();
        if(comment.length > 200){
            console.log('comment too long');
            return;
        }

        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({content: comment, postID, userID: currentUser._id})
            });
            if(res.ok){
                const data = await res.json();
                console.log('Comment submitted.');
                setComment('');
            }else{
              setError('Error in submitting the comment.');
            }

        } catch (error) {
            setError(error.message);
        }
    }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex gap-3 item-center my-5 text-sm text-gray-600 dark:text-gray-400">
            <p className="">Signed in as:</p>
            <img
                src={currentUser.profilePicture}
                alt="user"
                className="w-6 h-6 object-cover rounded-full border-[1px] border-gray-500"
            />
            <Link to={'/dashboard?tab=profile'} className="text-blue-600 dark:text-blue-400">
                @<p className="inline-block hover:underline">{currentUser.username}</p>
            </Link>
        </div>
      ) : (
        <div className="flex gap-2 item-center my-5 text-sm text-blue-600 dark:text-blue-400">
            You must be signed in to comment.
            <Link to={'/sign-in'} target="_blank" className="hover:underline mx-2">Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border-2 border-hl-purple p-3 rounded-lg">
            <Textarea
                placeholder="Add a comment..."
                rows="3"
                maxLength='200'
                onChange={(e) => setComment(e.target.value)}
                value={comment}
            />
            <div className="flex items-center justify-between w-full mt-2 p-3">
                <p className="text-xs text-gray-400 italic">{200 - comment.length} characters remaining</p>
                <Button outline gradientDuoTone="pinkToOrange" type="submit">
                    Submit
                </Button>
            </div>
            {error && (
              <Alert color='failure'>
                {error}
              </Alert>
            )}
        </form>
      )
      }
    </div>
  )
}
