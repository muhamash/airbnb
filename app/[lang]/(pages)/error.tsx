'use client';

interface ErrorPageProps {
    error: Error;
    reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
    // const router = useRouter();
    console.log( error );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
            <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
            <p className="text-lg mb-8">An unexpected error has occurred. Please try again.</p>
            <div className="flex space-x-4">
                <button
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors font-nunito"
                    onClick={() => reset()}
                >
                    Reload
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;