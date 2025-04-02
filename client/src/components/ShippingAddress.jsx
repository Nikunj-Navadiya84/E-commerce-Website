import React from 'react'

function ShippingAddress() {
    return (
        <div>
            <div className='text-3xl font-semibold text-gray-700 py-5'>
                <h2>Shipping <span className='text-green-700'>Address</span></h2>
            </div>
            <div className="container p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex gap-6">
                        <div className="w-full">
                            <p className="text-md mb-2 text-gray-700">First Name</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="First Name" readOnly />
                        </div>
                        <div className="w-full">
                            <p className="text-md mb-2 text-gray-700">Last Name</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Last Name" readOnly />
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <div className='w-full'>
                            <p className="text-md mb-2 text-gray-700">Email</p>
                            <input type="email" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Email" readOnly />
                        </div>
                        <div className='w-full'>
                            <p className="text-md mb-2 text-gray-700">Phone</p>
                            <input type="email" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Phone" readOnly />
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <div className='w-full'>
                            <p className="text-md mb-2 text-gray-700">Address 1</p>
                            <textarea type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Address 1" readOnly />
                        </div>
                        <div className='w-full'>
                            <p className="text-md mb-2 text-gray-700">Address 1</p>
                            <textarea type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Address 2" readOnly />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div>
                            <p className="text-md mb-2 text-gray-700">City</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="City" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">Pincode</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="Pincode" required />
                        </div>
                        <div>
                            <p className="text-md mb-2 text-gray-700">State</p>
                            <input type="text" className="border border-gray-300 text-sm text-gray-700 rounded py-2 px-3 w-full shadow-sm" placeholder="State" required/>
                        </div>
                    </div>

                    <div>
                    <button className='text-sm text-white bg-gray-700 rounded hover:bg-gray-900 cursor-pointer px-3 py-2'>Submit</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ShippingAddress
