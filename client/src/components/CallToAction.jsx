import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 my-10 border-2 border-hl-pink border-dashed rounded-3xl ">
      <div className="flex-1 flex flex-col gap-3 justify-around p-8 w-full mx-auto text-center">
        <h1 className="text-xl font-medium">Want to keep learning about full stack development?</h1>
        <p className="text-gray-500 dark:text-gray-400">Join us to receive updates on our latest posts.</p>
        <Button className="bg-gradient-to-r hover:bg-gradient-to-l from-hl-orange via-hl-pink to-hl-purple">
            Sign In
        </Button>
      </div>
      <div className="flex-1 p-8 w-full">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvGnqFV7NfXvYUdeeV65w2EDAQOKivKBXCRrQ7IfN_KA&s" className="w-full" />
      </div>
    </div>
  )
}
