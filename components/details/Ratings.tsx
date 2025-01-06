interface RatingsProps {
    value: number;
}

export default function Ratings({ value }: RatingsProps) {
    const stars = Array.from( { length: 5 }, ( _, index ) => (
        <i
            key={index}
            className={`fas fa-star ${ index < value ? 'text-yellow-500' : 'text-gray-300' }`}
        ></i>
    ) );

    return (
        <div>
            <div className="flex items-center">
                {stars}
            </div>
        </div>
    );
}