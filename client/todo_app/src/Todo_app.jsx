import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Login from './AllPart/Login';
import Add_work_form from './AllPart/Add_work_form';
import Navbar from './AllPart/Navbar';


function parseTimeToDate(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
}


export default function Todo_app() {
    let valid = localStorage.getItem('user');
    let [name, setname] = useState('');
    let [email, setemail] = useState('');
    let [password, setpassword] = useState('');
    let [sign, setsign] = useState(false);
    let [login, setLogin] = useState(false);
    let [work, setWork] = useState(false);
    let [items, setItems] = useState([]);


    const token = localStorage.getItem('user');
    let u_id = null;
    if (token) {
        try {
            u_id = jwtDecode(token); // decode করা object
        } catch (err) {
            console.error("Invalid token:", err);
        }
    }

    let [data, setData] = useState({
        name: '',
        starttime: '',
        endtime: '',
        description: '',
        user_id: u_id ? u_id.id : '',
    });

    //  sign up
    const SignUp = (e) => {
        e.preventDefault();

        axios.post("http://localhost:5000/sign-up", { name, email, password })
            .then((response) => {
                console.log("Server response:", response.data);
                localStorage.setItem("user", response.data.token);
                alert(response.data.msg || "Signup Successful!");
                if (response.status == 200) {
                    setLogin(false);
                    window.location.reload();
                }
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.error || "Signup failed. Please try again.");
                } else {
                    alert("Something went wrong. Please try again later.");
                }
                console.error("Signup Error:", error);
            });



    };
    // sign in
    const SignIn = (e) => {
        e.preventDefault();
        // console.log(email,password);
        axios.post("http://localhost:5000/sign-in", { email, password })
            .then((response) => {
                console.log("Server response:", response.data);
                localStorage.setItem("user", response.data.token);
                if (response.status == 200) {
                    setLogin(false);
                    window.location.reload();
                }
                // alert(response.data.msg || "Signup Successful!");
            })
            .catch((error) => {
                if (error.response) {
                    alert(error.response.data.error || "Signup failed. Please try again.");
                } else {
                    alert("Something went wrong. Please try again later.");
                }
                console.error("Signup Error:", error);
            });

    }
    // props pass login model
    let model = {
        setname,
        setemail,
        setpassword,
        SignUp,
        SignIn
    }
    // forms get value
    const getvalue = (e) => {
        let { name, value } = e.target;
        setData({ ...data, [name]: value })
    };

    const fetchData = () => {
        axios.get('http://localhost:5000/get-work', {
            headers: { authorization: localStorage.getItem('user') }
        })
            .then((res) => {
                console.log(res.data)
                console.log(res.status)
                if (res.status === 201) {
                    localStorage.removeItem("user");
                    setItems([]);
                    return;
                }
                setItems(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.log(err)
                // setItems([]);
            });
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handle = (e) => {
        e.preventDefault();
        const newItem = { ...data, animate: true };
        setItems([...items, newItem]);
        console.log(newItem)
        axios.post('http://localhost:5000/add-task', newItem)
            .then((res) => {
                console.log(res.data);
                console.log(newItem);
                fetchData(); // Refresh the list after adding a new task
            })
            .catch((err) => {
                console.log(err);
            })

        // Reset form
        setData({
            name: '',
            starttime: '',
            endtime: '',
            description: '',
            user_id: u_id ? u_id.id : '',
        });

        // Turn off animation flag after transition
        setTimeout(() => {
            setItems((prev) =>
                prev.map((itm, idx) =>
                    idx === prev.length - 1 ? { ...itm, animate: false } : itm
                )
            );
        }, 1000); // matches duration-700

        setWork(false);

    };

    const dlt = (id, index) => {
        console.log(id)
        axios.delete(`http://localhost:5000/delete/${id}`)
            .then((res) => {
                console.log(res.data)
                // Refresh the list after deletion 
                fetchData();
            })
            .catch((err) => console.log(err));

        setItems((prev) => {
            const newItems = [...prev];
            newItems[index].animate = true; // Set animate to true for the item being deleted
            return newItems;
        });

    }

    const status_handle = (e, id) => {
        e.preventDefault();
        const newform = new FormData(e.target);
        const status = newform.get('radio');
        axios.post('http://localhost:5000/status-update', { id, status })
            .then((res) => {
                console.log(res.data)
                fetchData();
            })
            .catch((err) => console.log(err));
    }

    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000); // প্রতি সেকেন্ডে আপডেট
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!valid || !Array.isArray(items)) return;
        items.forEach((item) => {
            const endTime = parseTimeToDate(item.endtime);
            if (item.status == 1) return;
            if (endTime <= now && item.status !== 2) {
                axios
                    .post("http://localhost:5000/status-update", { id: item._id, status: 2 })
                    .then(() => fetchData())
                    .catch((err) => console.log(err));
            }
        });
    }, [now]);


    return (
        <div className='h-[100vh] md:h-screen  bg-blue-950'>
            <Navbar off={() => setWork(true)} login={() => setLogin(true)} />
            {
                valid !== null ?
                    <h1 className='text-[16px] md:text-3xl text-gray-500 text-center font-bold italic'>Your Daily Task</h1>
                    :
                    ""
            }

            {
                valid !== null ?
                    items.length > 0 ? (
                        <div className='md:w-[100%] mx-auto md:mt-1 drop-shadow-lg'>
                            <table className='table-fixed  w-full'>
                                <thead className='bg-blue-700 text-white  opacity-60 '>
                                    <tr className='text-[14px]'>
                                        <th className='w-[5%] font-semibold text-[10px] md:text-[18px]  text-center italic text-gray-200 '>No</th>
                                        <th className='w-[10%] md:w-[13%]  font-semibold text-[10px] md:text-[18px]  text-center italic text-gray-200 '>Task</th>
                                        <th className='w-[17%] md:w-[25%] font-semibold text-[10px] md:text-[18px]  text-center italic text-gray-200 '>Description</th>
                                        <th className='w-[12%] font-semibold text-[10px] md:text-[18px]  text-center italic text-gray-200 '>Start Time</th>
                                        <th className='w-[10%] font-semibold text-[10px] md:text-[18px]  text-center italic text-gray-200 '>End Time</th>
                                        <th className='w-[8%] font-semibold text-[10px] md:text-[18px]  text-center italic text-gray-200 '>Action</th>
                                        <th className='w-[21%] md:w-[15%] font-semibold text-[10px] md:text-[18px]  text-center italic text-gray-200 '>Status</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {items.filter(item => new Date(item.date).toLocaleDateString("en-GB") === new Date().toLocaleDateString("en-GB"))
                                        .map((item, index) => {
                                            const endTime = parseTimeToDate(item.endtime);
                                            const isIC = endTime <= now;
                                            return (
                                                <tr
                                                    key={index}
                                                    className={`text-center relative transition-all duration-700 ease-in-out ${item.animate ? "opacity-0 -translate-x-20" : "opacity-100 translate-x-0"
                                                        }`}>

                                                    <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-gray-200">{index + 1}</td>
                                                    <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-gray-200">{item.name}</td>
                                                    <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-gray-200">{item.description}</td>
                                                    <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-gray-200">{item.starttime}</td>
                                                    <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-gray-200">{item.endtime}</td>
                                                    <td className="font-serif my-1 p-1 text-[10px] md:text-[15px]  md:p-3 text-gray-200 cursor-pointer"><span onClick={(e) => dlt(item._id, index)} className='hover:bg-green-600 hover:p-1 rounded-3xl hover:text-white duration-500 ease-in-out'>✕</span></td>
                                                    <td>
                                                        <div>
                                                            <form action="" onSubmit={(e) => status_handle(e, item._id)}>
                                                                <div className='flex justify-center  gap -1 md:gap-2'>
                                                                    <label htmlFor="" className='text-gray-200 text-[7px] md:text-[15px] italic font-sans'>Pen</label>
                                                                    <input type="radio" name='radio' className="accent-amber-300 border-0 scale-[0.5] md:scale-100" id="" value={0} checked={item.status == 0} disabled={item.status == 1 || item.status == 2} onChange={(e) => e.target.form.requestSubmit()} />
                                                                    <label htmlFor="" className='text-gray-200 text-[7px] md:text-[15px] italic font-sans'>Com</label>
                                                                    <input type="radio" name='radio' className="accent-green-400 scale-[0.5] md:scale-100" id="" value={1} checked={item.status == 1} disabled={item.status == 2} onChange={(e) => e.target.form.requestSubmit()} />
                                                                    <label htmlFor="" className='text-gray-200 text-[7px] md:text-[15px] italic font-sans'>InCom</label>
                                                                    <input type="radio" name='radio' className="accent-red-500 scale-[0.5] md:scale-100" id="" value={2} checked={item.status == 1 ? false : isIC} disabled={item.status == 1} onChange={(e) => e.target.form.requestSubmit()} />


                                                                </div>
                                                            </form>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )
                                    }
                                </tbody>

                            </table>
                        </div>
                    ) : ''
                    :
                    <div className='ms-8 md:ms-40 mt-20 '>
                        <h1 className='text-3xl md:text-5xl text-gray-500  font-bold italic mb-5'>Stay Organized. Get Things Done.</h1>
                        <p className='text-gray-300 md:ms-10 italic'>A simple, fast, and secure way to manage your daily tasks and boost productivity.</p>
                        <div className='flex flex-col md:flex-row justify-center md:justify-start items-center'>
                            <button className='w-1/2 md:w-auto md:text-2xl text-blue-300 text-shadow-md text-shadow-blue-500 font-bold italic py-1 px-2 shadow shadow-orange-50 rounded-2xl bg-blue-700 mt-20'>Get Started Free</button>
                            <button className='w-1/2 md:w-auto md:text-2xl text-black font-bold italic py-1 px-2 shadow shadow-orange-100 rounded-2xl bg-amber-300 mt-5 md:mt-20 md:ms-6' onClick={() => setLogin(true)}>Login</button>
                        </div>
                    </div>
            }

            {login ? <Login off={() => setLogin(false)} show={sign} hide={() => setsign(true)} all={model} /> : ''}
            <Add_work_form work={work} show={() => setWork(false)} getvalue={getvalue} data={data} handle={handle} />
        </div>
    )
}