// Ritaglia un'immagine (coordinate dall'alto a sinistra) e la salva in JPEG.
//   swift tools/crop.swift <in> <out.jpg> <x> <y> <larghezza> <altezza>
import AppKit
let a = CommandLine.arguments
guard a.count >= 7, let img = NSImage(contentsOfFile: a[1]), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("uso: crop.swift <in> <out> <x> <y> <w> <h>"); exit(1) }
let r = CGRect(x: Double(a[3])!, y: Double(a[4])!, width: Double(a[5])!, height: Double(a[6])!)
let sub = cg.cropping(to: r)!
let rep = NSBitmapImageRep(cgImage: sub)
try! rep.representation(using: .jpeg, properties: [.compressionFactor: 0.82])!.write(to: URL(fileURLWithPath: a[2]))
print("\(a[2])  \(sub.width)x\(sub.height)")
