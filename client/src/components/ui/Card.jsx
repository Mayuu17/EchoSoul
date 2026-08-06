function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-slate-900 rounded-xl shadow-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;