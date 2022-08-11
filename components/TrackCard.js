import Image from "next/image"

export default function TrackCard({image, name, artist, href, uri, handleClick, handlePause, handleQueue, isPaused, handleSave}){
    return (
        <li className="bg-white rounded-md py-2 px-1 hover:scale-105 cursor-pointer flex justify-between">
                <div className="flex justify-start">
                    <a href={href} target='_blank' rel="noopener noreferrer">
                        <Image
                        width='70px'
                        height='70px'
                        src={image}
                        alt={'albumcoverof'+name}
                        />
                    </a>
                    <div className="flex flex-col justify-center pl-2">
                        <div className="font-semibold text-black">{name}</div>
                        <div className="text-slate-400">{artist}</div>
                    </div>
                </div>
                <div className="text-black w-3/6 flex justify-around items-center border-2 border-solid border-black mr-4">
                    <span onClick={()=>{handleClick(uri)}}>play</span>
                    <span onClick={handlePause}>{isPaused ? 'resume' : 'pause'}</span>
                    <span onClick={()=>{handleQueue(uri)}}>add to queue</span>
                    <span onClick={()=>{handleSave(uri)}}>add to your saved library</span>
                </div>
        </li>
    )
}