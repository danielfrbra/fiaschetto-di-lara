// Converte un'immagine in WebP (ImageIO, macOS 14+), con larghezza massima opzionale.
//   swift tools/webp.swift <in> <out.webp> <qualità 0-1> [larghezza max]
import Foundation
import ImageIO
import CoreGraphics
let a = CommandLine.arguments
guard a.count >= 4 else { print("uso: webp.swift <in> <out.webp> <q> [maxw]"); exit(1) }
guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil) else { print("non leggo \(a[1])"); exit(1) }
var img: CGImage
if a.count > 4, let maxw = Int(a[4]) {
  let opts: [CFString: Any] = [kCGImageSourceCreateThumbnailFromImageAlways: true, kCGImageSourceThumbnailMaxPixelSize: maxw, kCGImageSourceCreateThumbnailWithTransform: true]
  img = CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary)!
} else {
  img = CGImageSourceCreateImageAtIndex(src, 0, nil)!
}
guard let dst = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, "org.webmproject.webp" as CFString, 1, nil) else { print("WebP non supportato"); exit(2) }
CGImageDestinationAddImage(dst, img, [kCGImageDestinationLossyCompressionQuality: Double(a[3])!] as CFDictionary)
guard CGImageDestinationFinalize(dst) else { print("scrittura fallita"); exit(3) }
let size = (try? FileManager.default.attributesOfItem(atPath: a[2])[.size] as? Int) ?? 0
print("\(a[2])  \(img.width)x\(img.height)  \(size / 1024) KB")
