import { Button } from "antd";

function PrimaryButton({ Children, disabled, ...props }: any) {
  return (
    <Button
      type="primary"
      className={` !h-11 text-base font-medium min-w-[100px] ${disabled ? "bg-primary/70 hover:!bg-primary/70 cursor-no-drop" : "bg-primary hover:!bg-primary"}`}
      children={Children}
      {...props}
    />
  );
}

export default PrimaryButton;
