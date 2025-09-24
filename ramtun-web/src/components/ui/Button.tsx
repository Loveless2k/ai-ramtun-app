import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ramtun-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ramtun-primary text-white hover:bg-ramtun-primary/90 shadow-ramtun hover:shadow-ramtun-lg",
        secondary: "bg-ramtun-secondary text-white hover:bg-ramtun-secondary/90 shadow-ramtun hover:shadow-ramtun-lg",
        accent: "bg-ramtun-accent text-white hover:bg-ramtun-accent/90 shadow-ramtun hover:shadow-ramtun-lg",
        outline: "border-2 border-ramtun-primary text-ramtun-primary hover:bg-ramtun-primary hover:text-white",
        ghost: "text-ramtun-primary hover:bg-ramtun-primary/10",
        destructive: "bg-error text-white hover:bg-error/90",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-6 text-base",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl",
      },
      animation: {
        none: "",
        hover: "hover:scale-105",
        glow: "animate-glow",
        float: "animate-float",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      animation: "hover",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    loading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    const buttonContent = (
      <>
        {icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            Cargando...
          </div>
        ) : (
          children
        )}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    )

    if (animation === 'none') {
      return (
        <button
          className={cn(buttonVariants({ variant, size, animation, className }))}
          ref={ref}
          disabled={isDisabled}
          {...props}
        >
          {buttonContent}
        </button>
      )
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: animation === 'hover' ? 1.05 : 1 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...(props as unknown as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {buttonContent}
      </motion.button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
