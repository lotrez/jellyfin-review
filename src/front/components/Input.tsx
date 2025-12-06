import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
	return (
		<div className="flex flex-col gap-2 w-full">
			{label && (
				<label htmlFor={props.id} className="text-sm font-medium text-text-secondary">
					{label}
				</label>
			)}
			<input
				className={`
					w-full px-4 py-3 
					bg-input-bg 
					text-text-primary
					border border-border
					rounded-md
					outline-none
					transition-all duration-200
					placeholder:text-text-tertiary
					focus:border-primary
					focus:ring-2 focus:ring-primary/20
					disabled:opacity-50 disabled:cursor-not-allowed
					${error ? "border-error focus:border-error focus:ring-error/20" : ""}
					${className}
				`}
				{...props}
			/>
			{error && (
				<span className="text-sm text-error">{error}</span>
			)}
		</div>
	);
}
