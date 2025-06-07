import clsx from "clsx";

export default function Button({ className, ...props }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition",
        className
      )}
      {...props}
    />
  );
}
