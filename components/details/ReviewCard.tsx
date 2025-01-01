import { userModel } from "@/models/users";
import { ObjectId } from 'mongodb';
import Image from "next/image";
import ReviewClient from "./ReviewClient";

interface ReviewProps {
    review: {
        userId: string;
        image?: string;
        title: string;
        text: string;
    };
    isUserHasReview: boolean;
}

export default async function ReviewCard({ review, isUserHasReview }: ReviewProps) {
    const reviewer = await userModel.findOne({ _id: new ObjectId(review.userId) });

    return (
        <div className="space-y-2 flex justify-between items-start bg-slate-100 border-[0.5px] border-slate-200 shadow-sm hover:shadow-lg shadow-violet-300 transition-all duration-200 rounded-lg p-3">
            <div className="flex flex-col gap-4 space-y-4">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        <Image
                            src={reviewer?.image || "/default-avatar.jpg"}  // Use a fallback image if no image
                            alt={reviewer?.name || "Anonymous"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-kanit text-amber-500 font-semibold">{reviewer?.name || "Anonymous"}</h4>
                        <p className="text-gray-500 text-sm">December 2024</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                    <i className="fas fa-star text-yellow-500"></i>
                </div>
                <p className="text-gray-600 leading-relaxed font-ubuntu">
                    {review.text}
                </p>
            </div>

            {isUserHasReview && (
                <ReviewClient />
            )}
        </div>
    );
}