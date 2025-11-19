export function Separator({ className = "" }) {
  return (
    <hr
      className={`border-t border-border my-4 ${className}`}
      aria-orientation="horizontal"
    />
  );
}

export default Separator;