import { useEffect, useState } from "react";
import moment from 'moment';
import { BiSolidLike } from "react-icons/bi";

export default function Comment({comment}) {

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
                    console.log(user);
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
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{comment.content}</p>
                </div>
                <div className="w-fit px-2 py-2 text-gray-600 dark:text-gray-400 border-t-2 border-gray-200 dark:border-gray-800">
                    <BiSolidLike />
                </div>
              </div>
            </div>
    </div>
  )
}
