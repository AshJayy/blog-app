import { useEffect, useState } from "react";
import moment from 'moment';
import { BiSolidLike } from "react-icons/bi";
import { Button } from "flowbite-react";

export default function Comment({comment, onLike, onDelete, currentUser}) {

    const [user, setUser] = useState({
        username: '',
        profilePicture: ''
    })

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userID}`);
                if(res.ok){
                    const data = await res.json();
                    setUser({
                        username: data.username,
                        profilePicture: data.profilePicture
                    });
                }else{
                    const error = await res.json()
                    console.log(error.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        getUser();
    }, [comment])


  return (
    <div>
      <div className="flex flex-row gap-5 items-center mb-3 px-8 border-b-2 border-gray-200 dark:border-gray-800">
              <img
                className="w-10 h-10 object-cover rounded-full self-center flex-shrink-0"
                src={user.profilePicture}
                alt={user.username}
              />
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex flex-row gap-2 text-xs">
                  <span className="font-semibold truncate">{user? user.username : "anonymous"}</span>
                  <span className="text-gray-500">{moment(comment.createdAt).fromNow()}</span>
                </div>
                <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm ">{comment.content}</p>
                </div>
                <div className={`flex gap-4 max-w-fit border-t-2 p-2 pb-3 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 ${
                        currentUser && comment.likes.includes(currentUser._id) && '!text-hl-pink'
                      }`}>
                    <button
                      type="button"
                      className={`hover:text-hl-pink dark:hover:text-hl-pink `}
                      onClick={() => onLike(comment._id)}
                    >
                      <BiSolidLike />
                    </button>
                    {comment.numberOfLikes > 0 &&
                    <span className="text-xs">
                        {comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")}
                    </span>
                    }
                    {currentUser && (currentUser._id === comment.userID || currentUser.isAdmin) && (
                      <button
                      className="text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer"
                      onClick={() => onDelete(comment._id)}
                      >Delete</button>
                    )}
                </div>
              </div>
            </div>
    </div>
  )
}
