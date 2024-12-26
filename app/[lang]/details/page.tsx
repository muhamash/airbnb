import Property from "@/components/details/Property";
import Review from "@/components/details/Review";

export default async function Details() {
    return (
        <div className="py-[100px]">
            <Property />
            <Review/>
        </div>
    );
}
