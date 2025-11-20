import { Input } from "antd";
import { useState } from "react";

function InputFiled({
  onChange,
  value,
  label,
  disabled,
  type = "text",
  accept = "",
}: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <label
        className={`absolute left-4 z-[1] bg-white text-gray-500 pointer-events-none transition-all duration-200 
          ${
            focused || value
              ? "-top-2 text-xs !text-primary px-1"
              : "top-[18px] text-base !text-[#999]"
          }`}
      >
        {label}
      </label>
      <Input
        className={`py-2 px-4 !text-[17px] h-[62px] w-full border border-[#e5e7eb] rounded-[16px] !shadow-none !bg-white ${
          disabled
            ? "hover:border-[#e5e7eb]"
            : "focus:border-primary hover:border-primary"
        }`}
        type={type}
        accept={accept}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default InputFiled;
