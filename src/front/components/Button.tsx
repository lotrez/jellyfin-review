import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost";
	fullWidth?: boolean;
}

export default function Button({ 
	variant = "primary", 
	fullWidth = false, 
	className = "", 
	children,
	...props 
}: ButtonProps) {
	const baseStyles = `
		px-6 py-3 
		rounded-md 
		font-medium 
		transition-all duration-200
		outline-none
		disabled:opacity-50 disabled:cursor-not-allowed
		${fullWidth ? "w-full" : ""}
	`;

	const variantStyles = {
		primary: `
			bg-primary 
			text-white
			hover:bg-primary-hover
			active:bg-primary-active
			focus:ring-2 focus:ring-primary/40
		`,
		secondary: `
			bg-secondary-bg
			text-text-primary
			border border-border
			hover:bg-secondary-bg-hover
			active:bg-secondary-bg-active
			focus:ring-2 focus:ring-border
		`,
		ghost: `
			bg-transparent
			text-text-primary
			hover:bg-secondary-bg
			active:bg-secondary-bg-hover
			focus:ring-2 focus:ring-border
		`,
	};

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
