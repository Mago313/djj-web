import React from 'react';

type TProps = {
  type: string;
  value: string;
  maxLength: number;
  onChange: () => void;
  multiple?: boolean;
  placeholder: string;
  style: string;
};

const Input = ({
  value,
  onChange,
  placeholder,
  type,
  multiple,
  style,
}: TProps) => {
  return (
    <input
      className={style}
      value={value}
      onChange={onChange}
      multiple={multiple}
      placeholder={placeholder}
      type={type}
    />
  );
};

export default Input;
