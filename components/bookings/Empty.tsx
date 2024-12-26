
export default async function Empty() {
    return (
        <div id="empty-state" className=" text-center py-12">
            <img
                src="/no-bookings-icon.svg"
                alt="No Bookings"
                className="mx-auto mb-4 w-32 h-32"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No Bookings Yet
            </h2>
            <p className="text-zinc-500 text-sm">
                You haven&rsquo;t made any bookings. Start exploring amazing stays!
            </p>
        </div>
    );
}
