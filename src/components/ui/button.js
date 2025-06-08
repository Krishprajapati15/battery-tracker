import clsx from "clsx";

export default function Button({ className, ...props }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}
