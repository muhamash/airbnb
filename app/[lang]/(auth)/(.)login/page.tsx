import Form from "@/components/auth/Form";
import Modal from "@/components/common/Modal";

export default async function LoginPage() {
  return (
    <Modal>
      <Form isLogIn={ true } />
    </Modal>
  )
}
