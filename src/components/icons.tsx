import type { SVGProps } from "react";

/** 与主站一致的细线图标：1.5px stroke，无填充，统一圆角端点 */
function IconBase({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M8 3v10M3 8h10" />
    </IconBase>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 8.5l3.5 3.5L13 5" />
    </IconBase>
  );
}

export function IconTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M2.5 4.5h11M6.5 4.5V3h3v1.5M4 4.5l.7 9h6.6l.7-9M6.7 7v4M9.3 7v4" />
    </IconBase>
  );
}

export function IconEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M11.5 2.5l2 2L5 13l-2.7.7L3 11l8.5-8.5z" />
    </IconBase>
  );
}

export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="7" cy="7" r="4.2" />
      <path d="M10.2 10.2L14 14" />
    </IconBase>
  );
}

export function IconX(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </IconBase>
  );
}
