import { userModel } from "@/models/users";
import { formatDate } from "@/utils/utils";
import { ObjectId } from 'mongodb';
import Image from "next/image";
import Ratings from "./Ratings";
import ReviewClient from "./ReviewClient";

interface ReviewProps {
    review: {
        userId: string;
        image?: string;
        title: string;
        text: string;
        ratings: number;
        createdAt: Date;
        updatedAt: Date;
    };
    isUserHasReview: boolean;
}

export default async function ReviewCard({ review, isUserHasReview }: ReviewProps) {

    return (
        <div className="space-y-2 flex justify-between items-start bg-slate-100 border-[0.5px] border-slate-200 shadow-sm hover:shadow-lg shadow-violet-300 transition-all duration-200 rounded-lg p-3">
            <div className="flex flex-col gap-4 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        <Image
                            src={review?.image || "/default-avatar.jpg"}
                            alt={review?.name || "Anonymous"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-kanit text-amber-500 font-semibold">{review?.name || "Anonymous"}</h4>
                        <p className="text-gray-500 text-sm">{formatDate( review?.updatedAt )}</p>
                    </div>
                </div>
                <Ratings value={review?.ratings} />
                <p className="text-gray-600 leading-relaxed font-ubuntu">
                    {review.text}
                </p>
            </div>

            {isUserHasReview && (
                <ReviewClient reviewId={review?._id.toString()} />
            )}
        </div>
    );
}