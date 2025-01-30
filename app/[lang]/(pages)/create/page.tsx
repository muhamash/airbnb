import Create from "@/components/create/old"
import { FormProvider } from "@/utils/FormContext"

export default async function CreatePage() {
  return (
    <FormProvider>
      <Create/>
    </FormProvider>
  )
}