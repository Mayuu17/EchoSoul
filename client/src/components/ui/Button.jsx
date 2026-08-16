function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
}) {
  const baseStyle =
    "px-8 py-3 rounded-xl font-semibold transition duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-cyan-400 text-slate-950 hover:bg-cyan-300",
    secondary:
      "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;