function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          px-4
          py-3
          rounded-lg
          bg-slate-900
          border
          border-slate-700
          text-white
          outline-none
          focus:border-cyan-400
          transition
        "
      />
    </div>
  );
}

export default Input;