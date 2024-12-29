import Form from "@/components/auth/Form";
import Modal from "@/components/common/Modal";

export default function RegistrationPage() {
  return (
    <Modal>
      <Form isLogIn={ false }/>
    </Modal>
  );
}