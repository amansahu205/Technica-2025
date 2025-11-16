import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionTitleVariants = cva(
  "font-bold text-balance",
  {
    variants: {
      size: {
        h1: "text-4xl md:text-5xl lg:text-6xl",
        h2: "text-3xl md:text-4xl lg:text-5xl",
        h3: "text-2xl md:text-3xl lg:text-4xl",
        h4: "text-xl md:text-2xl lg:text-3xl",
        h5: "text-lg md:text-xl lg:text-2xl",
        h6: "text-base md:text-lg lg:text-xl",
      },
      gradient: {
        true: "bg-gradient-to-r from-primary to-accent-green bg-clip-text text-transparent",
        false: "",
      },
    },
    defaultVariants: {
      size: "h2",
      gradient: false,
    },
  }
)

export interface SectionTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof sectionTitleVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  subtitle?: string
}

const SectionTitle = React.forwardRef<HTMLHeadingElement, SectionTitleProps>(
  ({ className, size, gradient, as: Component = "h2", subtitle, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Component
          ref={ref}
          className={cn(sectionTitleVariants({ size, gradient }), className)}
          {...props}
        >
          {children}
        </Component>
        {subtitle && (
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            {subtitle}
          </p>
        )}
      </div>
    )
  }
)
SectionTitle.displayName = "SectionTitle"

export { SectionTitle, sectionTitleVariants }
