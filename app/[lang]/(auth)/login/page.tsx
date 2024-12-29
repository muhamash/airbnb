import Form from "@/components/auth/Form";

export default async function LoginPage() {
    return (
        <div className="flex items-center justify-center w-full h-screen">
            <Form isLogIn={ true } />
        </div>
    );
}
