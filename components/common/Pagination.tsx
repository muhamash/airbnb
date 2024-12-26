
export default function Pagination() {
    return (
        <div className="mt-8 flex justify-center">
            <nav aria-label="Page navigation">
                <ul className="inline-flex items-center -space-x-px">
                    <li>
                        <a
                            href="#"
                            className="block py-2 px-3 ml-0 leading-tight text-zinc-500 bg-white rounded-l-lg border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
                        >
                            <span className="sr-only">Previous</span>
                            <i className="fas fa-chevron-left"></i>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="py-2 px-3 leading-tight text-zinc-500 bg-white border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
                        >1</a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="py-2 px-3 leading-tight text-zinc-500 bg-white border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
                        >2</a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="py-2 px-3 leading-tight text-zinc-500 bg-white border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
                        >3</a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="block py-2 px-3 leading-tight text-zinc-500 bg-white rounded-r-lg border border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700"
                        >
                            <span className="sr-only">Next</span>
                            <i className="fas fa-chevron-right"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
