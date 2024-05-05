import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden transition-transform hover:scale-105">
          <img src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-4 border-gray-300 dark:border-gray-700"
          />
        </div>
        <TextInput
          className="rounded-lg hover:border-[1px] dark:hover:border-gray-400"
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
        />
        <TextInput
          className="rounded-lg hover:border-[1px] dark:hover:border-gray-400"
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
        />
        <TextInput
          className="rounded-lg hover:border-[1px] dark:hover:border-gray-400"
          type="password"
          id="password"
          placeholder="Password"
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
