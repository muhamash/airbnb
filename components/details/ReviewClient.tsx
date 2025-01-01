export default function ReviewClient() {
    return (
        <div className="flex flex-col gap-2">
            <button className="flex items-center justify-center px-2 py-1 bg-violet-500 text-white rounded-lg hover:bg-amber-600 transition-all">
                <i className="fas fa-edit mr-2"></i>
                Edit
            </button>
            <button className="flex items-center justify-center px-2 py-1 bg-red-400 text-white rounded-lg hover:bg-rose-700 transition-all">
                <i className="fas fa-trash mr-2"></i>
                Delete
            </button>
        </div>
    );
}