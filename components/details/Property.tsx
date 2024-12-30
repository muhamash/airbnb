import Link from "next/link";

export default async function Property() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* !-- Property Title and Rating --> */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Maldives Paradise</h1>
                <div className="flex items-center text-gray-600">
                    <i className="fas fa-star text-yellow-500 mr-1"></i>
                    <span>5 · </span>
                    <span className="ml-2">2 reviews</span>
                    <span className="mx-2">·</span>
                    <span className="">Maldives, Tropical Paradise</span>
                </div>
            </div>
            {/* <!-- Image Gallery --> */}
            <div className="grid grid-cols-4 grid-rows-2 gap-4 mb-8 h-[500px]">
                <div className="col-span-2 row-span-2">
                    <img
                        src="https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Main Room"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Room 1"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Room 2"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1472224371017-08207f84aaae?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Room 3"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <div>
                    <img
                        src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Room 4"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            </div>
            {/* <!-- Property Details --> */}
            <div className="grid grid-cols-3 gap-8">
                {/* <!-- Left Column: Property Description --> */}
                <div className="col-span-2">
                    <div className="border-b pb-6 mb-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            Entire villa hosted by Sarah
                        </h2>
                        <div className="grid grid-cols-3 gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-person"></i>
                                <span>6 guests</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-door-open"></i>
                                <span>3 bedrooms</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-bed"></i>
                                <span>4 beds</span>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Description --> */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-4">About this place</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Experience luxury in this stunning beachfront villa nestled in the
                            heart of the Maldives. Our spacious 3-bedroom villa offers
                            breathtaking ocean views, private pool, and direct beach access.
                            Enjoy modern amenities, traditional Maldivian architecture, and
                            unparalleled comfort in this tropical paradise.
                        </p>
                    </div>

                    {/* <!-- Amenities --> */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-umbrella-beach"></i>
                                <span>Beach access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-person-swimming"></i>
                                <span>Private pool</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-wifi"></i>
                                <span>Free Wi-Fi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-sink"></i>
                                <span>Kitchen</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Right Column: Booking Card --> */}
                <div>
                    <div className="bg-white shadow-lg rounded-xl p-6 border">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-xl font-bold">$450</span>
                                <span className="text-gray-600 ml-1">per night</span>
                            </div>
                            <div className="flex items-center">
                                <i className="fas fa-star text-yellow-500 mr-1"></i>
                                <span>5</span>
                            </div>
                        </div>

                        <div className="border rounded-lg mb-4">
                            <div className="grid grid-cols-2 border-b">
                                <input
                                    type="text"
                                    placeholder="Check in"
                                    className="p-3 border-r"
                                />
                                <input type="text" placeholder="Check out" className="p-3" />
                            </div>
                            <input type="number" placeholder="Guests" className="w-full p-3" />
                        </div>

                        <Link
                            href="/payment"
                            className="w-full block text-center bg-cyan-600 text-white py-3 rounded-lg transition-all hover:brightness-90"
                        >
                            Reserve
                        </Link>

                        <div className="text-center mt-4 text-gray-600">
                            <p>You won&#39;t be charged yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
