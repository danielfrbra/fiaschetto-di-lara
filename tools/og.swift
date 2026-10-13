// Genera public/og.jpg (1200x630): l'anteprima che WhatsApp, Facebook e iMessage
// mostrano quando si condivide il link. JPEG a 0.85 per restare sotto i 300 KB.
//   swift tools/og.swift public/og.jpg
import AppKit

let out = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "public/og.jpg"
let W = 1200, H = 630
let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: W, pixelsHigh: H, bitsPerSample: 8,
                           samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                           colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
rep.size = NSSize(width: W, height: H)
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)

let ink = NSColor(red: 0.165, green: 0.043, blue: 0.078, alpha: 1)      // #2a0b14
let vino = NSColor(red: 0.42, green: 0.10, blue: 0.17, alpha: 1)        // #6b1a2b
let paglia = NSColor(red: 0.882, green: 0.725, blue: 0.420, alpha: 1)   // #e1b96b
let crema = NSColor(red: 0.965, green: 0.933, blue: 0.878, alpha: 1)    // #f6eee0

ink.setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: W, height: H)).fill()
// alone vinaccia in basso a destra
let glow = NSGradient(colors: [vino.withAlphaComponent(0.95), ink.withAlphaComponent(0)])!
glow.draw(fromCenter: NSPoint(x: 980, y: 120), radius: 0, toCenter: NSPoint(x: 980, y: 120), radius: 760, options: [])

// fiasco stilizzato a destra
let f = NSBezierPath()
f.lineWidth = 7; f.lineCapStyle = .round; f.lineJoinStyle = .round
let ox: CGFloat = 905, oy: CGFloat = 90, s: CGFloat = 7.0
func P(_ x: CGFloat, _ y: CGFloat) -> NSPoint { NSPoint(x: ox + x * s, y: oy + (64 - y) * s) }
f.move(to: P(28, 9)); f.line(to: P(36, 9)); f.line(to: P(36, 19))
f.curve(to: P(40, 26), controlPoint1: P(36, 22), controlPoint2: P(37.5, 24))
f.curve(to: P(47.5, 41), controlPoint1: P(44.6, 29.9), controlPoint2: P(47.5, 35))
f.curve(to: P(32, 56.5), controlPoint1: P(47.5, 50), controlPoint2: P(40.5, 56.5))
f.curve(to: P(16.5, 41), controlPoint1: P(23.5, 56.5), controlPoint2: P(16.5, 50))
f.curve(to: P(24, 26), controlPoint1: P(16.5, 35), controlPoint2: P(19.4, 29.9))
f.curve(to: P(28, 19), controlPoint1: P(26.5, 24), controlPoint2: P(28, 22))
f.close()
paglia.withAlphaComponent(0.9).setStroke(); f.stroke()
for y in [37.0, 45.0] as [CGFloat] {
  let st = NSBezierPath(); st.lineWidth = 7; st.lineCapStyle = .round
  let inset: CGFloat = y == 37 ? 3 : 2
  st.move(to: P(16.5 + inset, y)); st.curve(to: P(47.5 - inset, y), controlPoint1: P(26, y + 3.2), controlPoint2: P(38, y + 3.2))
  st.stroke()
}

// testi
let para = NSMutableParagraphStyle(); para.lineSpacing = 0
let titleFont = NSFont(name: "Baskerville-SemiBold", size: 96) ?? NSFont.systemFont(ofSize: 96, weight: .semibold)
let title = NSAttributedString(string: "Il Fiaschetto", attributes: [.font: titleFont, .foregroundColor: crema, .paragraphStyle: para])
title.draw(at: NSPoint(x: 88, y: 330))
let diFont = NSFont(name: "Baskerville-Italic", size: 72) ?? NSFont.systemFont(ofSize: 72)
let di = NSAttributedString(string: "di Lara", attributes: [.font: diFont, .foregroundColor: paglia])
di.draw(at: NSPoint(x: 92, y: 250))
let subFont = NSFont.systemFont(ofSize: 30, weight: .medium)
let sub = NSAttributedString(string: "Vino sfuso e bottiglie  ·  Montespertoli, via Garibaldi 4", attributes: [.font: subFont, .foregroundColor: crema.withAlphaComponent(0.78)])
sub.draw(at: NSPoint(x: 92, y: 160))
let line = NSBezierPath(); line.lineWidth = 3
line.move(to: NSPoint(x: 92, y: 140)); line.line(to: NSPoint(x: 160, y: 140)); paglia.setStroke(); line.stroke()
let eye = NSAttributedString(string: "LA BOTTEGA DEL VINO, E LA BACHECA DEL PAESE", attributes: [.font: NSFont.systemFont(ofSize: 20, weight: .bold), .foregroundColor: paglia, .kern: 4])
eye.draw(at: NSPoint(x: 92, y: 100))

NSGraphicsContext.restoreGraphicsState()
let jpg = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85])!
try! jpg.write(to: URL(fileURLWithPath: out))
print("scritto \(out): \(jpg.count / 1024) KB")
