import { Input } from "antd";
import { useState } from "react";

function SearchField({
  onChange,
  value,
  label,
  disabled,
  type = "text",
  accept = "",
  labelClassName = "",
  errorsMessage,
  mainClassName = "",
  ...prop
}: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`relative allowClear-search ${mainClassName}`}>
      <label
        className={`absolute left-4 z-10 bg-white text-gray-500 pointer-events-none transition-all duration-200 
          ${focused || value
            ? "-top-2 text-xs !text-primary px-1"
            : "top-4 text-base !text-[#999]"
          } ${labelClassName}`}
      >
        {label}
      </label>
      <Input.Search
        className="floating-search-filed"
        type={type}
        accept={accept}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        allowClear
        {...prop}
      />
      {errorsMessage && (
        <p className="text-red-500 text-xs mt-1">
          {errorsMessage}
        </p>
      )}
    </div>
  );
}

export default SearchField;
