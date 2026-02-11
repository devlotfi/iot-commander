import { Button, Form, Modal, type UseOverlayStateReturn } from "@heroui/react";
import { Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useFormik } from "formik";
import ValidatedTextField from "../validated-text-field";

interface PasswordModalProps {
  state: UseOverlayStateReturn;
  onSubmit: (value: string) => void;
}

export default function AddConnectionModal({
  state,
  onSubmit,
}: PasswordModalProps) {
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: yup.object({
      password: yup.string().required(),
    }),
    onSubmit(values) {
      onSubmit(values.password);
      state.close();
    },
  });

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal.Backdrop
      isOpen={state.isOpen}
      onOpenChange={state.setOpen}
      variant="blur"
    >
      <Modal.Container placement="center">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Key className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{t("connectionAuthenthication")}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="p-[0.1rem]">
            <Form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-[0.5rem]"
            >
              <ValidatedTextField
                formik={formik}
                name="password"
                textFieldProps={{ isRequired: true }}
                inputProps={{
                  type: isVisible ? "text" : "password",
                }}
                labelProps={{ children: t("password") }}
                suffix={
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    onPress={toggleVisibility}
                  >
                    {isVisible ? <EyeOff></EyeOff> : <Eye></Eye>}
                  </Button>
                }
              ></ValidatedTextField>

              <Button fullWidth type="submit" className="mt-[1rem]">
                {t("connect")}
              </Button>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
