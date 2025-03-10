import Link from "next/link";

export default function PreviewButton() {
    return (
        <Link href={`${ process.env.NEXT_PUBLIC_URL }/en/create/preview`}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:brightness-90 top-4 right-4"
        >
            <i className="fas fa-file-alt mr-2"></i>
            Prev
        </Link>
    );
}