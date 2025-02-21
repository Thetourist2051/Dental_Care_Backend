const PDFDocument = require('pdfkit');

function createPDFStream(res) {
    return new Promise((resolve, reject) => {
        try {
            console.log("Generating PDF...");

            const doc = new PDFDocument();
            res.setHeader('Content-Disposition', 'attachment; filename="sample.pdf"');
            res.setHeader('Content-Type', 'application/pdf');

            doc.pipe(res);

            doc.fontSize(25).text('Hello, this is a PDF file created with Node.js!', 100, 100);

            // Draw a line
            doc.moveTo(100, 150).lineTo(500, 150).stroke();

            doc.end();

            doc.on('end', resolve);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    createPDFStream
};
