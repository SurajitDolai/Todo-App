import React from 'react'

export default function Login({ off, show, hide, all }) {
    let { setname, setemail, setpassword, SignIn, SignUp } = all;
  return (
     <div className="fixed h-[50%] md:h-auto inset-0 bg-[rgba(0,0,0,0.3)] flex md:items-center justify-center">
            <div className="bg-gradient-to-t to-blue-100 from-blue-500  md:w-[35%] p-9 rounded-full shadow-sm shadow-amber-100 relative">
                <button className="absolute top-2 right-2 text-white font-bold cursor-pointer" onClick={()=>off()}>
                    ✕
                </button>
                <div>
                    <p className='text-center font-bold italic text-2xl text-gray-700'>{show ? 'Sign Up' : 'Sign In'}</p>
                    {
                        show ?
                            <form onSubmit={SignUp}>
                                <div>
                                    <div className='my-2'>
                                        <label htmlFor="name" className='font-bold italic  text-green-700'>Name:</label>
                                        <input type="text" placeholder='Enter your name' name='name' id='name' className='w-full rounded-2xl py-1 px-2 outline-0 bg-white' onChange={(e) => setname(e.target.value)} required />
                                    </div>
                                    <div className='my-2'>
                                        <label htmlFor="email" className='font-bold italic  text-green-700'>Email:</label>
                                        <input type="email" placeholder='Enter your @...' name='email' id='email' className='w-full rounded-2xl py-1 px-2 outline-0 bg-white' onChange={(e) => setemail(e.target.value)} required />
                                    </div>
                                    <div className='my-2'>
                                        <label htmlFor="password" className='font-bold italic  text-green-700'>Password:</label>
                                        <input type="password" placeholder='Enter your password' name='password' id='password' className='w-full rounded-2xl py-1 px-2 outline-0 bg-white' onChange={(e) => setpassword(e.target.value)} required />
                                    </div>
                                    <div className='flex my-2'>
                                        <button type='submit' className='w-2/4 bg-green-600 rounded-3xl text-white italic mx-auto p-1 cursor-pointer'>Sign Up</button>
                                    </div>
                                </div>
                            </form>
                            :
                            <form onSubmit={SignIn}>
                                <div>
                                    <div className='my-2'>
                                        <label htmlFor="" className='font-bold italic  text-green-700'>Email:</label>
                                        <input type="email" placeholder='Enter your @...' name="" id="email" className='w-full rounded-2xl p-1 outline-0 bg-white' onChange={(e) => setemail(e.target.value)} />
                                    </div>
                                    <div className='my-2'>
                                        <label htmlFor="" className='font-bold italic  text-green-700'>Password:</label>
                                        <input type="password" placeholder='Enter your password' name="password" id="password" className='w-full rounded-2xl p-1 outline-0 bg-white' onChange={(e) => setpassword(e.target.value)} />
                                    </div>
                                    <div className='flex my-2'>
                                        <button type='submit' className='w-2/4 bg-green-600 rounded-3xl text-white italic mx-1 p-1 cursor-pointer'>Sign In</button>
                                        <button onClick={hide} className='w-2/4 bg-green-600 rounded-3xl text-white italic mx-1 p-1 cursor-pointer'>Sign Up</button>
                                    </div>
                                </div>
                            </form>
                    }

                </div>
            </div>
        </div>
  )
}
