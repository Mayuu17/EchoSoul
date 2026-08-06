function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
}) {
  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold transition duration-300";

  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-600 text-white",

    secondary:
      "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;