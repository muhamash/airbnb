
export default function ActionButton() {
    return (
        <form action={`/api/download/invoice`} method="GET" className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
                type="submit"
                className="px-6 py-3 bg-green-700 text-white rounded-lg hover:brightness-90"
            >
                <i className="fas fa-download mr-2"></i>
                Download Receipt
            </button>
        </form>
    );
}