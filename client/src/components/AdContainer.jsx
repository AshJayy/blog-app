import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import 'intersection-observer';

export default function AdContainer({dependency, category, position}) {

    const [ad, setAd] = useState({});
    const adRef = useRef(null)

    useEffect(() => {
        const adCategory= category === 'uncategorized' ? '' : category;
        const fetchAd = async () => {
            try {
                const res = await fetch(`/api/ad/publish?category=${adCategory}&position=${position}`)
                if(!res.ok){
                    const text = await res.text();
                    console.log(text);
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

    useEffect(() => {

        const markAsViewed = async () => {
            if(!ad._id) return;
            try {
                const res = await fetch(`/api/ad/markviewed/${ad._id}`, {
                    method: 'PUT'
                });
            } catch (error) {
                console.log(error.message);
            }
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        markAsViewed();
                        observer.unobserve(adRef.current);
                    }
                })
            },
            {threshold: 0.5}
        );

        if(adRef.current) {
            observer.observe(adRef.current);
        }

        return () => {
            if(adRef.current){
                observer.unobserve(adRef.current);
            }
        };

    }, [ad])

  return (
    <div ref={adRef} className="flex flex-col items-center justify-center my-8">
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
                        <img src={ad.image} />
                    </div>
                </div>
            )
            }
        </Link>
        <p className="text-xs text-gray-500">Advertisement</p>
    </div>

  )
}
