// Prepara un clip Kling per il sito:
//   swift tools/video.swift <in.mp4> <out.mp4> <bitrate>
// 1. ritaglia il 5% per lato e il 10% in basso (via il watermark Kling in basso a destra)
// 2. riporta a 1280x720
// 3. riscrive in H.264 senza audio, al bitrate richiesto
import AVFoundation
import AppKit
import CoreGraphics

let args = CommandLine.arguments
guard args.count >= 4 else { print("uso: video.swift <in.mp4> <out.mp4> <bitrate>"); exit(1) }
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2]), bitrate = Int(args[3])!
let W = 1280, H = 720

let asset = AVURLAsset(url: inURL)
guard let track = asset.tracks(withMediaType: .video).first else { print("niente video"); exit(1) }
let nat = track.naturalSize.applying(track.preferredTransform)
let sw = abs(nat.width), sh = abs(nat.height)
let CROP_X = sw * 0.05, CROP_Y: CGFloat = 0, CROP_W = sw * 0.90, CROP_H = sh * 0.90
let SX = CGFloat(W) / CROP_W, SY = CGFloat(H) / CROP_H

let reader = try AVAssetReader(asset: asset)
let output = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(output)
try? FileManager.default.removeItem(at: outURL)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: bitrate, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: 60, AVVideoAllowFrameReorderingKey: true],
])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
writer.add(input)
writer.startWriting(); writer.startSession(atSourceTime: .zero); reader.startReading()
let space = CGColorSpaceCreateDeviceRGB()
var count = 0
while let sample = output.copyNextSampleBuffer() {
  guard let src = CMSampleBufferGetImageBuffer(sample) else { continue }
  let time = CMSampleBufferGetPresentationTimeStamp(sample)
  CVPixelBufferLockBaseAddress(src, .readOnly)
  let w = CVPixelBufferGetWidth(src), h = CVPixelBufferGetHeight(src)
  let srcCtx = CGContext(data: CVPixelBufferGetBaseAddress(src), width: w, height: h, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(src), space: space, bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)
  let img = srcCtx?.makeImage()
  CVPixelBufferUnlockBaseAddress(src, .readOnly)
  guard let image = img else { continue }
  var pbOut: CVPixelBuffer?
  CVPixelBufferPoolCreatePixelBuffer(nil, adaptor.pixelBufferPool!, &pbOut)
  guard let dst = pbOut else { continue }
  CVPixelBufferLockBaseAddress(dst, [])
  guard let ctx = CGContext(data: CVPixelBufferGetBaseAddress(dst), width: W, height: H, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(dst), space: space, bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue) else { CVPixelBufferUnlockBaseAddress(dst, []); continue }
  ctx.interpolationQuality = .high
  ctx.draw(image, in: CGRect(x: -CROP_X * SX, y: -(CGFloat(h) - CROP_Y - CROP_H) * SY, width: CGFloat(w) * SX, height: CGFloat(h) * SY))
  CVPixelBufferUnlockBaseAddress(dst, [])
  while !input.isReadyForMoreMediaData { usleep(2000) }
  adaptor.append(dst, withPresentationTime: time)
  count += 1
}
input.markAsFinished()
let sem = DispatchSemaphore(value: 0); writer.finishWriting { sem.signal() }; sem.wait()
if writer.status == .failed { print("errore: \(writer.error?.localizedDescription ?? "?")"); exit(1) }
let size = (try? FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
print(String(format: "%@  %dx%d→%dx%d  %d fotogrammi  %.0f KB", outURL.lastPathComponent, Int(sw), Int(sh), W, H, count, Double(size) / 1024))
