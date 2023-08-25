export const PowerIcon = ({
  fill = "currentColor",
  filled,
  size,
  height,
  width,
  label,
  ...props
}: any) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size || width || 24}
      height={size || height || 24}
      {...props}
    >
      <g
        fill="none"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
        />
      </g>
    </svg>
  );
};
