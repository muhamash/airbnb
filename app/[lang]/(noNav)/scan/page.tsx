interface ScanPageProps
{
    searchParams: URLSearchParams;
}

export default async function ScanPage ({searchParams}: ScanPageProps)
{
    console.log( searchParams );
    return (
        <div>
            Scan page
        </div>
    );
}