import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const root = process.cwd()
const chunksDir = path.join(root, 'legacy', 'media-bundle')
const targetRoot = root

if (!fs.existsSync(chunksDir)) {
  console.warn('[restore-media] media bundle not found, skipping.')
  process.exit(0)
}

const chunkFiles = fs.readdirSync(chunksDir)
  .filter((name) => /^part-\d+\.txt$/.test(name))
  .sort()

if (!chunkFiles.length) {
  console.warn('[restore-media] no media bundle chunks found, skipping.')
  process.exit(0)
}

const encoded = chunkFiles
  .map((name) => fs.readFileSync(path.join(chunksDir, name), 'utf8').trim())
  .join('')

const tar = zlib.gunzipSync(Buffer.from(encoded, 'base64'))

function readString(buffer, start, length) {
  return buffer.subarray(start, start + length).toString('utf8').replace(/\0.*$/, '')
}

function readOctal(buffer, start, length) {
  const value = readString(buffer, start, length).trim()
  return value ? Number.parseInt(value, 8) : 0
}

let offset = 0
let restored = 0
while (offset + 512 <= tar.length) {
  const header = tar.subarray(offset, offset + 512)
  if (header.every((byte) => byte === 0)) break

  const name = readString(header, 0, 100)
  const prefix = readString(header, 345, 155)
  const fullName = prefix ? `${prefix}/${name}` : name
  const size = readOctal(header, 124, 12)
  const type = String.fromCharCode(header[156] || 48)
  const dataStart = offset + 512
  const dataEnd = dataStart + size
  const outputPath = path.resolve(targetRoot, fullName)

  if (!outputPath.startsWith(path.resolve(targetRoot) + path.sep)) {
    throw new Error(`Unsafe path in media archive: ${fullName}`)
  }

  if (type === '5') {
    fs.mkdirSync(outputPath, { recursive: true })
  } else if (type === '0' || type === '\0') {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
    fs.writeFileSync(outputPath, tar.subarray(dataStart, dataEnd))
    restored += 1
  }

  offset = dataStart + Math.ceil(size / 512) * 512
}

console.log(`[restore-media] restored ${restored} legacy media files.`)
