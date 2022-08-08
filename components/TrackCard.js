import Image from "next/image"

export default function TrackCard({image, name, artist, href}){
    return (
        <li className="bg-white rounded-md py-2 px-1 hover:scale-105 cursor-pointer">
            <a href={href} target='_blank' rel="noopener noreferrer">
                <div className="flex justify-start">
                    <Image
                    width='70px'
                    height='70px'
                    src={image}
                    alt={'albumcoverof'+name}
                    />
                    <div className="flex flex-col justify-center pl-2">
                        <div className="font-semibold text-black">{name}</div>
                        <div className="text-slate-400">{artist}</div>
                    </div>
                </div>
            </a>
        </li>
    )
}