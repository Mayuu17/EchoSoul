function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
}) {
  const baseStyle =
    "w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-cyan-400 text-slate-950 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20",

    secondary:
      "border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-lg hover:shadow-cyan-400/20",
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