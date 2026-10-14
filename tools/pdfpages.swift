// Rende le pagine di un PDF in PNG, per controllarle a occhio.
//   swift tools/pdfpages.swift <file.pdf> <cartella-out> [larghezza px]
import Foundation
import PDFKit
import AppKit
let a = CommandLine.arguments
guard a.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: a[1])) else { print("uso: pdfpages.swift <pdf> <out> [w]"); exit(1) }
let w = a.count > 3 ? Int(a[3])! : 900
try? FileManager.default.createDirectory(atPath: a[2], withIntermediateDirectories: true)
for i in 0..<doc.pageCount {
  guard let p = doc.page(at: i) else { continue }
  let b = p.bounds(for: .mediaBox)
  let scale = CGFloat(w) / b.width
  let size = NSSize(width: b.width * scale, height: b.height * scale)
  let img = p.thumbnail(of: size, for: .mediaBox)
  guard let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff), let png = rep.representation(using: .png, properties: [:]) else { continue }
  let out = "\(a[2])/pagina-\(i + 1).png"
  try? png.write(to: URL(fileURLWithPath: out))
  print("\(out)  \(Int(size.width))x\(Int(size.height))")
}
print("pagine: \(doc.pageCount)")
