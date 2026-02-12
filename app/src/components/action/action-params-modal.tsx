import {
  Button,
  Form,
  Label,
  ListBox,
  Modal,
  Select,
  Switch,
  type UseOverlayStateReturn,
} from "@heroui/react";
import { Variable } from "lucide-react";
import {
  ValueType,
  type Action,
  type ActionData,
} from "../../types/action-call";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextField from "../validated-text-field";

interface ActionParamsModalProps {
  state: UseOverlayStateReturn;
  action: Action;
}

function setupInitialValues(action: Action): ActionData {
  const actionData: ActionData = {};

  for (const parameter of action.parameters) {
    switch (parameter.type) {
      case ValueType.INT:
        actionData[parameter.name] = 0;
        break;
      case ValueType.FLOAT:
        actionData[parameter.name] = 0;
        break;
      case ValueType.DOUBLE:
        actionData[parameter.name] = 0;
        break;
      case ValueType.BOOL:
        actionData[parameter.name] = false;
        break;
      case ValueType.STRING:
        actionData[parameter.name] = "";
        break;
      case ValueType.ENUM:
        actionData[parameter.name] = "";
        break;
    }
  }

  return actionData;
}

function setupYupSchema(action: Action) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yupObj: any = {};

  for (const parameter of action.parameters) {
    switch (parameter.type) {
      case ValueType.INT:
        yupObj[parameter.name] = yup.number().integer().required();
        break;
      case ValueType.FLOAT:
        yupObj[parameter.name] = yup.number().required();
        break;
      case ValueType.DOUBLE:
        yupObj[parameter.name] = yup.number().required();
        break;
      case ValueType.BOOL:
        yupObj[parameter.name] = yup.boolean();
        break;
      case ValueType.STRING:
        yupObj[parameter.name] = yup.string().required();
        break;
      case ValueType.ENUM:
        if (parameter.enumDefinition) {
          yupObj[parameter.name] = yup
            .string()
            .oneOf([...parameter.enumDefinition])
            .required();
        }
        break;
    }
  }

  return yup.object(yupObj);
}

export default function ActionParamsModal({
  state,
  action,
}: ActionParamsModalProps) {
  const formik = useFormik({
    initialValues: setupInitialValues(action),
    validationSchema: setupYupSchema(action),
    onSubmit(values) {
      console.log(values);
    },
  });

  function renderFields() {
    return action.parameters.map((parameter, index) => {
      switch (parameter.type) {
        case ValueType.INT:
          return (
            <ValidatedTextField
              key={`${parameter.name}-${index}`}
              formik={formik}
              name={parameter.name}
              textFieldProps={{ isRequired: true }}
              labelProps={{ children: parameter.name }}
              inputProps={{
                type: "number",
                onChange: (e) =>
                  formik.setFieldValue(parameter.name, Number(e.target.value)),
              }}
            ></ValidatedTextField>
          );
        case ValueType.FLOAT:
          return (
            <ValidatedTextField
              key={`${parameter.name}-${index}`}
              formik={formik}
              name={parameter.name}
              textFieldProps={{ isRequired: true }}
              labelProps={{ children: parameter.name }}
              inputProps={{
                type: "number",
                onChange: (e) =>
                  formik.setFieldValue(parameter.name, Number(e.target.value)),
              }}
            ></ValidatedTextField>
          );
        case ValueType.DOUBLE:
          return (
            <ValidatedTextField
              key={`${parameter.name}-${index}`}
              formik={formik}
              name={parameter.name}
              textFieldProps={{ isRequired: true }}
              labelProps={{ children: parameter.name }}
              inputProps={{
                type: "number",
                onChange: (e) =>
                  formik.setFieldValue(parameter.name, Number(e.target.value)),
              }}
            ></ValidatedTextField>
          );
        case ValueType.BOOL:
          return (
            <Switch
              key={`${parameter.name}-${index}`}
              isSelected={formik.values[parameter.name] as boolean}
              onChange={(value) => formik.setFieldValue(parameter.name, value)}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Label className="text-sm">Enable notifications</Label>
            </Switch>
          );
        case ValueType.STRING:
          return (
            <ValidatedTextField
              key={`${parameter.name}-${index}`}
              formik={formik}
              name={parameter.name}
              textFieldProps={{ isRequired: true }}
              labelProps={{ children: parameter.name }}
            ></ValidatedTextField>
          );
        case ValueType.ENUM:
          if (parameter.enumDefinition) {
            return (
              <Select
                key={`${parameter.name}-${index}`}
                value={formik.values[parameter.name] as string}
                onChange={(value) =>
                  formik.setFieldValue(parameter.name, value?.toString())
                }
              >
                <Label>{parameter.name}</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {parameter.enumDefinition.map((enumValue) => (
                      <ListBox.Item
                        key={enumValue}
                        id={enumValue}
                        textValue={enumValue}
                      >
                        {enumValue}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            );
          }
      }
    });
  }

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
              <Variable className="size-5" />
            </Modal.Icon>
            <Modal.Heading>Parameters</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="p-[0.3rem]">
            <Form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-[0.5rem]"
            >
              {renderFields()}

              <Button fullWidth type="submit" className="mt-[1rem]">
                Request
              </Button>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
