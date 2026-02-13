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
import {
  ValueType,
  type Action,
  type ActionData,
  type Variable,
} from "../../types/action-call";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextField from "../validated-text-field";
import { DynamicIcon } from "lucide-react/dynamic";

function setupInitialValues(action: Action): ActionData {
  const actionData: ActionData = {};

  for (const parameter of action.parameters) {
    switch (parameter.type) {
      case ValueType.INT:
        actionData[parameter.name] = "";
        break;
      case ValueType.FLOAT:
        actionData[parameter.name] = "";
        break;
      case ValueType.DOUBLE:
        actionData[parameter.name] = "";
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

function FieldLabel({ parameter }: { parameter: Variable }) {
  return (
    <span>
      <span className="mr-[0.3rem] text-accent">{parameter.type}</span>
      <span>{parameter.name}</span>
    </span>
  );
}

interface ActionParamsModalProps {
  state: UseOverlayStateReturn;
  action: Action;
  onSubmit: (actionData: ActionData) => void;
}

export default function ActionParamsModal({
  state,
  action,
  onSubmit,
}: ActionParamsModalProps) {
  const formik = useFormik({
    initialValues: setupInitialValues(action),
    validationSchema: setupYupSchema(action),
    onSubmit(values) {
      onSubmit(values);
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
              labelProps={{
                children: <FieldLabel parameter={parameter}></FieldLabel>,
              }}
              inputProps={{
                type: "number",
                step: "1",
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
              labelProps={{
                children: <FieldLabel parameter={parameter}></FieldLabel>,
              }}
              inputProps={{
                type: "number",
                step: "0.01",
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
              labelProps={{
                children: <FieldLabel parameter={parameter}></FieldLabel>,
              }}
              inputProps={{
                type: "number",
                step: "0.01",
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
              <Label className="text-sm">
                <FieldLabel parameter={parameter}></FieldLabel>
              </Label>
            </Switch>
          );
        case ValueType.STRING:
          return (
            <ValidatedTextField
              key={`${parameter.name}-${index}`}
              formik={formik}
              name={parameter.name}
              textFieldProps={{ isRequired: true }}
              labelProps={{
                children: <FieldLabel parameter={parameter}></FieldLabel>,
              }}
            ></ValidatedTextField>
          );
        case ValueType.ENUM:
          if (parameter.enumDefinition) {
            return (
              <Select
                key={`${parameter.name}-${index}`}
                isInvalid={formik.errors[parameter.name] !== undefined}
                value={formik.values[parameter.name] as string}
                onChange={(value) =>
                  formik.setFieldValue(parameter.name, value?.toString())
                }
              >
                <Label>
                  <FieldLabel parameter={parameter}></FieldLabel>
                </Label>
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

                {formik.errors[parameter.name] ? (
                  <div className="ml-[0.3rem] text-danger text-[9pt]">
                    {formik.errors[parameter.name]}
                  </div>
                ) : null}
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
              <DynamicIcon name="variable" className="size-5" />
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
