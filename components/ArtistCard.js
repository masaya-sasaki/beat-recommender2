import Image from "next/image"

export default function ArtistCard({image, artist, onClick}){
    return (
        <li className="bg-white mt-1 mr-1 rounded-md py-2 px-1 flex justify-start text-xs hover:scale-105" onClick={onClick}>
                    {/* <Image  
                    width='70px'
                    height='70px'
                    src={image}
                    /> */}
                    <div className="flex flex-col pl-2 justify-center">
                        <div className="text-slate-800">{artist}</div>
                    </div>
        </li>
    )
}