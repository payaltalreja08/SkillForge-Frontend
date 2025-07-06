const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');

// Generate certificate PDF
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id);
    const enrolled = user.enrolledCourses.some(ec => ec.courseId.toString() === courseId);
    if (!enrolled) {
      return res.status(403).json({ message: 'You must purchase the course to download certificate.' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 0 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${course.name}-${user.name}.pdf"`);
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 60;
    const contentWidth = pageWidth - (margin * 2);
    const centerX = pageWidth / 2;

    // Background
    doc.rect(0, 0, pageWidth, pageHeight).fill('#ffffff');

    // Outer border
    doc.save();
    doc.rect(40, 40, pageWidth - 80, pageHeight - 80)
       .lineWidth(3)
       .stroke('#2563eb');
    doc.restore();

    // Inner decorative border
    doc.save();
    doc.rect(50, 50, pageWidth - 100, pageHeight - 100)
       .lineWidth(1)
       .stroke('#93c5fd');
    doc.restore();

    // Header section - Company name and title
    let currentY = 90;
    
    // Company logo/name
    doc.fontSize(42)
       .font('Helvetica-Bold')
       .fillColor('#1e293b')
       .text('SkillForge', margin, currentY, { 
         align: 'center',
         width: contentWidth
       });

    currentY += 60;
    
    // Certificate title (moved further downward)
    currentY += 30; // extra space for margin
    doc.fontSize(22)
       .font('Helvetica')
       .fillColor('#64748b')
       .text('Certificate of Completion', margin, currentY, { 
         align: 'center',
         width: contentWidth
       });

    currentY += 25;

    // Decorative line (touching the title)
    doc.moveTo(centerX - 120, currentY)
       .lineTo(centerX + 120, currentY)
       .lineWidth(2)
       .stroke('#2563eb');

    currentY += 40;

    // Main content section
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#374151')
       .text('This is to certify that', margin, currentY, { 
         align: 'center',
         width: contentWidth
       });

    currentY += 30;

    // Student name (highlighted)
    doc.fontSize(36)
       .font('Helvetica-Bold')
       .fillColor('#1e293b')
       .text(user.name, margin, currentY, { 
         align: 'center',
         width: contentWidth
       });

    currentY += 45;

    // Course completion text
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#374151')
       .text('has successfully completed the course', margin, currentY, { 
         align: 'center',
         width: contentWidth
       });

    currentY += 30;

    // Course name (highlighted)
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#2563eb')
       .text(course.name, margin, currentY, { 
         align: 'center',
         width: contentWidth
       });

    currentY += 45;

    // Course details section (no instructor name here)
    const completionDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Create centered details section
    const detailsY = currentY + 15;
    const detailsBoxWidth = 400;
    const detailsStartX = centerX - (detailsBoxWidth / 2);

    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#64748b');

    // Duration
    doc.text('Duration:', detailsStartX, detailsY, { width: 100 });
    doc.font('Helvetica-Bold')
       .fillColor('#374151')
       .text(`${course.duration} hours`, detailsStartX + 100, detailsY, { width: 300 });

    // Completion date
    doc.font('Helvetica')
       .fillColor('#64748b')
       .text('Completed on:', detailsStartX, detailsY + 25, { width: 100 });
    doc.font('Helvetica-Bold')
       .fillColor('#374151')
       .text(completionDate, detailsStartX + 100, detailsY + 25, { width: 300 });

    currentY = detailsY + 60;

    // Certificate ID
    const certificateId = `SF-${courseId.slice(-8)}-${user._id.toString().slice(-8)}`;
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#9ca3af')
       .text(`Certificate ID: ${certificateId}`, margin, currentY, { 
         align: 'center',
         width: contentWidth
       });

    currentY += 45;

    // Signature section - positioned on the right side
    const signatureWidth = 160;
    const signatureX = pageWidth - margin - signatureWidth - 40; // Right side positioning
    
    // Horizontal line above instructor name
    doc.moveTo(signatureX, currentY)
       .lineTo(signatureX + signatureWidth, currentY)
       .lineWidth(1)
       .stroke('#374151');

    // Instructor name
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#64748b')
       .text(course.instructorName, signatureX, currentY + 10, { 
         align: 'center',
         width: signatureWidth
       });

    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#64748b')
       .text('Instructor', signatureX, currentY + 25, { 
         align: 'center',
         width: signatureWidth
       });

    // Footer section
    const footerY = pageHeight - 70;
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#9ca3af')
       .text('This certificate is issued by SkillForge Learning Platform', margin, footerY, { 
         align: 'center',
         width: contentWidth
       });

    doc.fontSize(9)
       .text('Verify at: skillforge.com/verify', margin, footerY + 15, { 
         align: 'center',
         width: contentWidth
       });

    doc.end();
  } catch (err) {
    console.error('Certificate generation error:', err);
    res.status(500).json({ message: 'Error generating certificate', error: err.message });
  }
};