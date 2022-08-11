export default function Instructions({signIn, getInfo, getTopTracks}){
    return (
        <section className='w-5/6 px-3 py-2 rounded-md bg-slate-500'>
          <h2 className='text-xl mb-2'>How to use in 5 steps</h2>
          <ul className='gap-3 text-black flex flex-col'>
            <li className='bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2 cursor-pointer hover:scale-105' onClick={signIn}>1. Sign in with Spotify</li>
            <li className='bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2 cursor-pointer hover:scale-105' onClick={getInfo}>2. Connect your account</li>
            <li className='bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2 cursor-pointer hover:scale-105' onClick={getTopTracks}>3. Get favorite tracks</li>
          </ul>
        </section>
    )
}