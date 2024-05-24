import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function AdContainer({dependency, category}) {
    const [ad, setAd] = useState({});
    useEffect(() => {
        const adCategory= (category === 'uncategorized' ? '' : category)
        const fetchAd = async () => {
            try {
                const res = await fetch(`/api/ad/publish?category=${adCategory}`)
                if(!res.ok){
                    console.log(data.message);
                    return;
                }
                const data = await res.json()
                setAd(data[0])
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchAd()

    }, [dependency])
  return (
    <div className="flex flex-col items-center justify-center my-8">
        <p className="text-xs text-gray-500">Advertisement</p>
        <Link to={ad.targetURL} target="_blank" className="border-[1px] border-gray-300 dark:border-gray-700">
            {ad.imageOnly ? (
                    <img
                        src={ad.image}
                        alt={"title"}
                        className=" max-h-80"
                    />
            ) : (
                <div className="flex flex-col sm:flex-row gap-4 bg-gray-200">
                    <div className="flex-1 flex flex-col gap-3 justify-around p-8 w-fit mx-auto text-center">
                        <h1 className="text-xl font-medium text-gray-800">{ad.title}</h1>
                    </div>
                    <div className="flex-1 p-3 w-full">
                        <img src={ad.image} className=" min-w-96" />
                    </div>
                </div>
            )
            }
        </Link>
        <p className="text-xs text-gray-500">Advertisement</p>
    </div>

  )
}
