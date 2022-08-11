export default function Footer(){
    return (
        <footer className='bg-[#191414] w-full mt-10'>
            <hr className='border-1 border-white'></hr>
            <div className='flex justify-between p-2 text-white'>
            <div>
                Created by Masaya Sasaki
            </div>
                <div>
                <a className='hover:text-gray-200' href='https://github.com/masaya-sasaki' target='_blank' rel='noopener noreferrer'>
                    Follow on Github 
                </a>
                </div>
            </div>
        </footer>
    )
}