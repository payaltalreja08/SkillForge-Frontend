const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Course = require('../models/Course');
const Feedback = require('../models/Feedback');

// Generate certificate PDF
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify user has purchased the course
    const user = await User.findById(req.user._id);
    if (!user.purchasedCourses.includes(courseId)) {
      return res.status(403).json({ message: 'You must purchase the course to download certificate.' });
    }
    
    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    
    // Check if feedback is submitted (required for certificate)
    const feedback = await Feedback.findOne({ courseId, userId: req.user._id });
    if (!feedback) {
      return res.status(400).json({ message: 'You must submit feedback before downloading certificate.' });
    }
    
    // Create PDF document
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${course.name}-${user.name}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');
    
    // Add border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#3b82f6');
    
    // Add inner border
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
       .lineWidth(1)
       .stroke('#64748b');
    
    // Add logo/title area
    doc.fontSize(48)
       .font('Helvetica-Bold')
       .fill('#1e293b')
       .text('SkillForge', doc.page.width / 2, 80, { align: 'center' });
    
    doc.fontSize(24)
       .font('Helvetica')
       .fill('#64748b')
       .text('Certificate of Completion', doc.page.width / 2, 140, { align: 'center' });
    
    // Add certificate content
    doc.fontSize(18)
       .font('Helvetica')
       .fill('#374151')
       .text('This is to certify that', doc.page.width / 2, 220, { align: 'center' });
    
    // Student name
    doc.fontSize(32)
       .font('Helvetica-Bold')
       .fill('#1e293b')
       .text(user.name, doc.page.width / 2, 260, { align: 'center' });
    
    doc.fontSize(18)
       .font('Helvetica')
       .fill('#374151')
       .text('has successfully completed the course', doc.page.width / 2, 310, { align: 'center' });
    
    // Course name
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fill('#3b82f6')
       .text(course.name, doc.page.width / 2, 350, { align: 'center' });
    
    // Course details
    doc.fontSize(16)
       .font('Helvetica')
       .fill('#64748b')
       .text(`Duration: ${course.duration} hours`, doc.page.width / 2, 400, { align: 'center' });
    
    doc.fontSize(16)
       .font('Helvetica')
       .fill('#64748b')
       .text(`Instructor: ${course.instructorName}`, doc.page.width / 2, 430, { align: 'center' });
    
    // Completion date
    const completionDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    doc.fontSize(16)
       .font('Helvetica')
       .fill('#64748b')
       .text(`Completed on: ${completionDate}`, doc.page.width / 2, 460, { align: 'center' });
    
    // Certificate ID
    const certificateId = `SF-${courseId.slice(-8)}-${user._id.toString().slice(-8)}`;
    doc.fontSize(14)
       .font('Helvetica')
       .fill('#9ca3af')
       .text(`Certificate ID: ${certificateId}`, doc.page.width / 2, 500, { align: 'center' });
    
    // Add signature line
    doc.moveTo(doc.page.width / 2 - 100, 550)
       .lineTo(doc.page.width / 2 + 100, 550)
       .stroke('#374151');
    
    doc.fontSize(14)
       .font('Helvetica')
       .fill('#64748b')
       .text('Course Instructor', doc.page.width / 2, 570, { align: 'center' });
    
    // Add footer
    doc.fontSize(12)
       .font('Helvetica')
       .fill('#9ca3af')
       .text('This certificate is issued by SkillForge Learning Platform', doc.page.width / 2, doc.page.height - 60, { align: 'center' });
    
    doc.fontSize(10)
       .font('Helvetica')
       .fill('#9ca3af')
       .text('Verify at: skillforge.com/verify', doc.page.width / 2, doc.page.height - 40, { align: 'center' });
    
    // Finalize PDF
    doc.end();
    
  } catch (err) {
    console.error('Certificate generation error:', err);
    res.status(500).json({ message: 'Error generating certificate', error: err.message });
  }
}; 