// Primo fotogramma di un video come JPEG (poster: si vede finché il video non parte).
//   swift tools/poster.swift <video.mp4> <out.jpg>
import AVFoundation
import AppKit
let a = CommandLine.arguments
guard a.count >= 3 else { print("uso: poster.swift <video> <out.jpg>"); exit(1) }
let gen = AVAssetImageGenerator(asset: AVURLAsset(url: URL(fileURLWithPath: a[1])))
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
let cg = try gen.copyCGImage(at: CMTime(seconds: 0.05, preferredTimescale: 600), actualTime: nil)
let rep = NSBitmapImageRep(cgImage: cg)
let jpg = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.8])!
try jpg.write(to: URL(fileURLWithPath: a[2]))
print("\(a[2])  \(cg.width)x\(cg.height)  \(jpg.count / 1024) KB")
