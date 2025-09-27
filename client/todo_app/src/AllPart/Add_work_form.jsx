import React from 'react'

export default function Add_work_form({ work, show, getvalue, data, handle }) {
  return (
   <div className={`md:w-[30%] w-[80%] bg-green-200 transition-all duration-700 ease-in-out absolute top-10 md:top-12 ${work ? 'left-0' : 'left-[-80%]'} `}>
            <p className="absolute top-2 right-2 text-black font-bold cursor-pointer" onClick={show}> ✕</p>
            <form onSubmit={handle} className='flex flex-col justify-center items-center'>
                <div className='w-[90%]  my-2'>
                    <label htmlFor="">Task</label>
                    <input type="text" name="name" id="task" placeholder='Enter your name' onChange={getvalue} value={data.name} className='w-full p-2 m-1 outline-0 bg-transparent border-b-[1px]' />
                </div>
                <div className='w-[90%] flex  justify-between my-2'>
                    <div>
                        <label htmlFor="">Stating Time </label>
                        <input type="time" name="starttime" id="Stime" placeholder='Enter your time' onChange={getvalue} value={data.starttime} className='w-full p-2 m-1 outline-0 bg-transparent border-b-[1px]' />
                    </div>
                    <div >
                        <label htmlFor="">Ending Time</label>
                        <input type="time" name="endtime" id="Etime" placeholder='Enter your time' onChange={getvalue} value={data.endtime} className='w-full p-2 m-1 outline-0 bg-transparent border-b-[1px]' />
                    </div>
                </div>
                <div className='w-[90%]  my-2'>
                    <label htmlFor="">Description</label>
                    <textarea name="description" id="description" placeholder='Enter your Description..' onChange={getvalue} value={data.description} className='w-full p-2 m-1 outline-0 border-b-[1px] ' />
                </div>

                <button type='submit' className='bg-green-700 px-4  py-2 m-2 rounded-b-full font-bold italic text-white cursor-pointer '>ADD</button>
            </form>
        </div>
  )
}
