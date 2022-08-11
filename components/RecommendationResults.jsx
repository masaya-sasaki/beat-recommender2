import TrackCard from "./TrackCard"

export default function RecommendationResults({recommendation, handleClick, handlePause, handleQueue, handleSave, isPaused}){
    return (
        <>
        {
            recommendation.length==0 ? <div></div> :
            <section className='w-5/6 px-3 py-2 rounded-md bg-slate-500'>
            <h2 className='text-2xl  text-center'>Recommended Track List</h2>
            <ul className='grid gap-1'>
            {
              recommendation.length==0 ? <div>fetching...</div> :
              recommendation.map(
                (item)=>(
                  <TrackCard
                    key={item+'recommendedtracks'}
                    image={item.image}
                    name={item.names}
                    artist={item.artist}
                    href={item.href}
                    uri={item.uri}
                    handleClick={handleClick}
                    handlePause={handlePause}
                    handleQueue={handleQueue}
                    isPaused={isPaused}
                    handleSave={handleSave}
                    />
                )
              )
            }
            </ul>
          </section>
          }
        </>
    )
}