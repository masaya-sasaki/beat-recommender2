export default function RecommendationButton({getRecommendation}){
    return (
        <div className='flex justify-center mt-5 mb-10 w-5/6 text-black'>
            <button onClick={getRecommendation} className='bg-gradient-to-r from-green-400 to-blue-500 w-5/6 rounded-lg py-1 px-2 hover:scale-105 cursor-pointer' >5. Get recommendation</button>
        </div>
    )
}