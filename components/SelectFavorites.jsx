import ArtistCard from "./ArtistCard"
import GenreCard from "./GenreCard"

export default function SelectFavorites({favoriteArtists, favoriteGenres, selectedArtists, selectedGenres, selectItem, removeItem}){
    return (
        <div className='w-5/6 bg-slate-500 mt-5 rounded-md px-3 py-2 '>
          <div className='grid grid-rows-1 grid-cols-4'>
            <div className='text-xl row-span-1 col-span-3'>Select from your favorite artists and genres</div>
            <div className='text-black row-span-1 col-span-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg py-1 px-2'>4. Select up to 5 total</div>
          </div>
          <div className='grid grid-rows-3 grid-cols-4 gap-2 mt-1'>
          <section className='row-span-2 col-span-3'>
            <h2 className=''>Favorite Artists</h2>
            <ul className=''>
              { 
              favoriteArtists.length ==0 ? <div>fetching...</div> :
              favoriteArtists.map((item)=><ArtistCard
              key={item+'favoriteartist'}
              onClick={()=>{selectItem(item, 'artist')}}
              image={''}
              artist={item}
            />)
              }
            </ul>
          </section>
          <section className='row-span-1 col-span-1'>
            <h2 className=' bg-gradient-to-r from-green-400 to-blue-500 rounded-md px-1 text-center'>Selected Favorite Artists</h2>
            <ul className=''>
              { 
              selectedArtists.length ==0 ? <div>None selected</div> :
              selectedArtists.map((item)=><ArtistCard
              key={item+'selectedartist'}
              onClick={()=>{removeItem(item, 'artist')}}
              image={''}
              artist={item}
            />)
              }
            </ul>
          </section>
          <section className='row-span-1 col-span-3' >
            <h2>Favorite Genres</h2>
            <ul className='grid grid-cols-2'>
            {
              favoriteGenres.length==0 ? <div>fetching</div> :
              favoriteGenres.map((item)=>
              <GenreCard
              key={item+'favoritegenre'}
              onClick={()=>{selectItem(item, 'genre')}}
              image={''}
              genre={item}
            />
              )
            }
            </ul>
          </section>
          <section className='col-span-1' >
            <h2 className=' bg-gradient-to-r from-green-400 to-blue-500 rounded-md px-1 text-center'>Selected Favorite Genres</h2>
            <ul className='grid grid-cols-2'>
            {
              selectedGenres.length==0 ? <div>None selected</div> :
              selectedGenres.map((item)=>
              <GenreCard
              key={item+'favoritegenre'}
              onClick={()=>{removeItem(item, 'genre')}}
              image={''}
              genre={item}
              />
              )
            }
            </ul>
          </section>
          </div>
        </div>
    )
}