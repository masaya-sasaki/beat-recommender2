import Image from "next/image"

export default function Header({name, getInfo}){
    return (
        <header className='w-full flex flex-col items-center'>
            <nav className='w-full'>
            <div className='bg-white float-right mt-3 mr-3 rounded-lg flex items-center pl-2 pr-3 hover:scale-105 cursor-pointer text-black' onClick={getInfo}>            
                {name=='' ? 
                    <>
                        <Image
                        alt='spotifylogo'
                        width='30px'
                        height='30px'
                        src={'/spotifylogo.png'}
                        />
                        <span className='text-sm'>Log in with Spotify</span>
                    </> 
                    :
                    <>
                        <Image
                        alt='spotifylogo'
                        width='30px'
                        height='30px'
                        src={'/spotifylogo.png'}
                        />
                        <span className='text-sm'>Connected as {name}</span> 
                    </>
                }
                </div>
            </nav>
            <div className='flex flex-col items-center  w-4/6 mt-2'>
                <div>Your favorite 5 artist and genres</div>
                <div className='-mt-1'>↓</div>
                <h1 className='text-5xl text-center text-white -mt-3'>🎧 Beat Recommender 2</h1>
                <div className='-mb-1'>↓</div>
                <div>List of recommended tracks</div>
            </div>
        </header>
    )
}