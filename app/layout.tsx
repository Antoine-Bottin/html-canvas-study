import "./general.scss"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="turb">
              <feTurbulence baseFrequency="0.012" opacity={0.1} />
            </filter>
          </defs>
        </svg>
        <svg id="svg-filter">
          <filter id="svg-blur">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="4"
            ></feGaussianBlur>
          </filter>
        </svg>
        <svg>
          <filter id="discrete">
            <feComponentTransfer>
              <feFuncR type="discrete" tableValues="0 0.5 0 1" />
              <feFuncG type="discrete" tableValues="0 0.5 0 1" />
              <feFuncB type="discrete" tableValues="0 0.5 0 1" />
              <feFuncA type="discrete" tableValues="0 0.5 0 1" />
            </feComponentTransfer>
          </filter>
        </svg>
      </body>
    </html>
  )
}
