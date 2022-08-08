import Image from "next/image"

export default function GenreCard({image, genre, onClick}){
    return (
        <li className="bg-white mt-1 mr-1 hover:scale-105 rounded-md py-2 px-1 flex justify-start text-xs" onClick={onClick}>
                    {/* <Image  
                    width='70px'
                    height='70px'
                    src={image}
                    /> */}
                    <div className="flex flex-col pl-2 justify-center">
                        <div className="text-slate-800">{genre}</div>
                    </div>
        </li>
    )
}