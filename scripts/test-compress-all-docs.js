const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PDFDocument, PDFName, PDFNumber } = require('pdf-lib');

async function compressPdfBuffer(pdfBuffer) {
  try {
    const doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    let modified = false;

    for (const [ref, obj] of doc.context.enumerateIndirectObjects()) {
      if (obj.dict) {
        const subtype = obj.dict.get(PDFName.of('Subtype'))?.toString();
        if (subtype === '/Image') {
          const filter = obj.dict.get(PDFName.of('Filter'))?.toString() || '';
          if (filter.includes('DCTDecode') && obj.contents && obj.contents.length > 30000) {
            try {
              const origImg = Buffer.from(obj.contents);
              const meta = await sharp(origImg).metadata();
              
              // Only compress if dimension is large or file is large
              if (meta.width > 1400 || meta.height > 1400 || origImg.length > 150000) {
                const compressed = await sharp(origImg)
                  .resize({ width: 1500, height: 1500, fit: 'inside', withoutEnlargement: true })
                  .jpeg({ quality: 75, mozjpeg: true })
                  .toBuffer();

                if (compressed.length < origImg.length * 0.9) {
                  const newMeta = await sharp(compressed).metadata();
                  obj.contents = new Uint8Array(compressed);
                  obj.dict.set(PDFName.of('Width'), PDFNumber.of(newMeta.width));
                  obj.dict.set(PDFName.of('Height'), PDFNumber.of(newMeta.height));
                  obj.dict.set(PDFName.of('Length'), PDFNumber.of(compressed.length));
                  modified = true;
                }
              }
            } catch (imgErr) {
              // skip unhandled image
            }
          }
        }
      }
    }

    if (!modified) return { buffer: pdfBuffer, changed: false };
    const newBytes = await doc.save();
    return {
      buffer: Buffer.from(newBytes),
      changed: newBytes.length < pdfBuffer.length
    };
  } catch (e) {
    return { buffer: pdfBuffer, changed: false, error: e.message };
  }
}

async function runLocalTest() {
  const dir = path.join('scratch', 'docs');
  const files = fs.readdirSync(dir);
  
  let origTotal = 0;
  let newTotal = 0;

  console.log('Testing compression on', files.length, 'PDFs...');

  for (const f of files) {
    const orig = fs.readFileSync(path.join(dir, f));
    origTotal += orig.length;
    
    const { buffer: compressed, changed } = await compressPdfBuffer(orig);
    newTotal += compressed.length;
    
    const origKB = Math.round(orig.length / 1024);
    const newKB = Math.round(compressed.length / 1024);
    const pct = changed ? ((1 - newKB / origKB) * 100).toFixed(1) + '%' : '0% (kept)';

    console.log(`${f}`);
    console.log(`  ${origKB} KB -> ${newKB} KB (${pct} reduction)`);

    // Verify it loads properly
    await PDFDocument.load(compressed);
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Total original: ${(origTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total after compression: ${(newTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Overall reduction: ${((1 - newTotal / origTotal) * 100).toFixed(1)}%`);
  console.log(`Total saved: ${((origTotal - newTotal) / 1024 / 1024).toFixed(2)} MB`);
}

runLocalTest();
