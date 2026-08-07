function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-white">
        {title}
      </h2>

      <p className="text-gray-400 mt-4">
        {subtitle}
      </p>
    </div>
  );
}

export default SectionHeading;