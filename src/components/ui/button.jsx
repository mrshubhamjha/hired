import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-rose-500 text-white hover:bg-rose-600 group-hover:relative overflow-hidden",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3", // Default button size
        sm: "h-10 px-4", // Small button
        lg: "h-16 px-12 text-lg font-bold", // Larger button size
        icon: "h-14 w-14", // Larger icon button
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {/* Shine gradient overlay specifically for hover */}
      {variant === "secondary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 animate-shine pointer-events-none"></span>
      )}
      {props.children}
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };

// Tailwind config for animations
const tailwindConfig = {
  theme: {
    extend: {
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-150%)" },
          "50%": { opacity: 0.5 },
          "100%": { transform: "translateX(150%)" },
        },
      },
      animation: {
        shine: "shine 1.5s ease-in-out infinite", // Adjust timing for smoother shine
      },
    },
  },
};

export default tailwindConfig;
