import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, GraduationCap } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { StudentRecords } from '@/entities';

export default function EditStudentPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Partial<StudentRecords>>({
    studentName: '',
    rollNumber: undefined,
    semester: '',
    dateOfBirth: '',
    emailAddress: '',
    totalClasses: undefined,
    classesAttended: undefined,
    subject1Name: '',
    subject1Marks: undefined,
    subject2Name: '',
    subject2Marks: undefined,
    overallGrade: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (id) {
      loadStudent();
    }
  }, [navigate, id]);

  const loadStudent = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const student = await BaseCrudService.getById<StudentRecords>('studentrecords', id);
      
      setFormData({
        studentName: student.studentName || '',
        rollNumber: student.rollNumber,
        semester: student.semester || '',
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split('T')[0]
          : '',
        emailAddress: student.emailAddress || '',
        totalClasses: student.totalClasses,
        classesAttended: student.classesAttended,
        subject1Name: student.subject1Name || '',
        subject1Marks: student.subject1Marks,
        subject2Name: student.subject2Name || '',
        subject2Marks: student.subject2Marks,
        overallGrade: student.overallGrade || '',
      });
    } catch (error) {
      console.error('Error loading student:', error);
      alert('Failed to load student record');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: string, value: any): string => {
    // Name validation - no numbers
    if (name === 'studentName' || name === 'subject1Name' || name === 'subject2Name') {
      if (value && /\d/.test(value)) {
        return 'Cannot contain numbers';
      }
    }

    // Semester validation - no numbers in semester name
    if (name === 'semester') {
      if (value && /^\d+$/.test(value)) {
        return 'Semester should be like "Fall 2024" or "Spring 2025"';
      }
    }

    // Number validation - no letters
    if (
      name === 'rollNumber' ||
      name === 'totalClasses' ||
      name === 'classesAttended' ||
      name === 'subject1Marks' ||
      name === 'subject2Marks'
    ) {
      if (value && isNaN(Number(value))) {
        return 'Must be a valid number';
      }
      if (value && Number(value) < 0) {
        return 'Cannot be negative';
      }
    }

    // Marks validation - 0-100
    if (name === 'subject1Marks' || name === 'subject2Marks') {
      if (value && (Number(value) < 0 || Number(value) > 100)) {
        return 'Marks must be between 0 and 100';
      }
    }

    // Attendance validation
    if (name === 'classesAttended') {
      const total = formData.totalClasses;
      if (total && value && Number(value) > Number(total)) {
        return 'Cannot exceed total classes';
      }
    }

    // Email validation
    if (name === 'emailAddress') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format';
      }
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof StudentRecords]);
      if (error) {
        newErrors[key] = error;
      }
    });

    // Check required fields
    if (!formData.studentName?.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    if (!formData.rollNumber) {
      newErrors.rollNumber = 'Roll number is required';
    }
    if (!formData.semester?.trim()) {
      newErrors.semester = 'Semester is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);

      const studentData: Partial<StudentRecords> = {
        _id: id,
        studentName: formData.studentName,
        rollNumber: formData.rollNumber ? Number(formData.rollNumber) : undefined,
        semester: formData.semester,
        dateOfBirth: formData.dateOfBirth || undefined,
        emailAddress: formData.emailAddress,
        totalClasses: formData.totalClasses ? Number(formData.totalClasses) : undefined,
        classesAttended: formData.classesAttended ? Number(formData.classesAttended) : undefined,
        subject1Name: formData.subject1Name,
        subject1Marks: formData.subject1Marks ? Number(formData.subject1Marks) : undefined,
        subject2Name: formData.subject2Name,
        subject2Marks: formData.subject2Marks ? Number(formData.subject2Marks) : undefined,
        overallGrade: formData.overallGrade,
      };

      await BaseCrudService.update('studentrecords', studentData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-electric-teal/30 border-t-electric-teal rounded-full animate-spin" />
          <p className="mt-4 text-foreground/60 font-paragraph">Loading student...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-deep-space-blue border-b border-electric-teal/20">
        <div className="max-w-[100rem] mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="border-electric-teal/30 text-foreground hover:bg-electric-teal/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-electric-teal" />
              <h1 className="text-2xl font-heading font-bold text-foreground">Edit Student</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[100rem] mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-deep-space-blue border border-electric-teal/20 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-heading font-bold text-electric-teal mb-6">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="studentName" className="text-foreground font-paragraph">
                      Student Name *
                    </Label>
                    <Input
                      id="studentName"
                      name="studentName"
                      type="text"
                      value={formData.studentName}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.studentName ? 'border-destructive' : ''
                      }`}
                      placeholder="Enter student name"
                    />
                    {errors.studentName && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.studentName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-foreground font-paragraph">
                      Roll Number *
                    </Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      type="number"
                      value={formData.rollNumber || ''}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.rollNumber ? 'border-destructive' : ''
                      }`}
                      placeholder="Enter roll number"
                    />
                    {errors.rollNumber && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.rollNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-foreground font-paragraph">
                      Semester *
                    </Label>
                    <Input
                      id="semester"
                      name="semester"
                      type="text"
                      value={formData.semester}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.semester ? 'border-destructive' : ''
                      }`}
                      placeholder="e.g., Fall 2024"
                    />
                    {errors.semester && (
                      <p className="text-sm text-destructive font-paragraph">{errors.semester}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-foreground font-paragraph">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="emailAddress" className="text-foreground font-paragraph">
                      Email Address
                    </Label>
                    <Input
                      id="emailAddress"
                      name="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.emailAddress ? 'border-destructive' : ''
                      }`}
                      placeholder="student@example.com"
                    />
                    {errors.emailAddress && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.emailAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div>
                <h2 className="text-xl font-heading font-bold text-electric-teal mb-6">
                  Attendance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="totalClasses" className="text-foreground font-paragraph">
                      Total Classes
                    </Label>
                    <Input
                      id="totalClasses"
                      name="totalClasses"
                      type="number"
                      value={formData.totalClasses || ''}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.totalClasses ? 'border-destructive' : ''
                      }`}
                      placeholder="Enter total classes"
                    />
                    {errors.totalClasses && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.totalClasses}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="classesAttended" className="text-foreground font-paragraph">
                      Classes Attended
                    </Label>
                    <Input
                      id="classesAttended"
                      name="classesAttended"
                      type="number"
                      value={formData.classesAttended || ''}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.classesAttended ? 'border-destructive' : ''
                      }`}
                      placeholder="Enter classes attended"
                    />
                    {errors.classesAttended && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.classesAttended}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div>
                <h2 className="text-xl font-heading font-bold text-electric-teal mb-6">
                  Academic Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject1Name" className="text-foreground font-paragraph">
                      Subject 1 Name
                    </Label>
                    <Input
                      id="subject1Name"
                      name="subject1Name"
                      type="text"
                      value={formData.subject1Name}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.subject1Name ? 'border-destructive' : ''
                      }`}
                      placeholder="e.g., Mathematics"
                    />
                    {errors.subject1Name && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.subject1Name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject1Marks" className="text-foreground font-paragraph">
                      Subject 1 Marks
                    </Label>
                    <Input
                      id="subject1Marks"
                      name="subject1Marks"
                      type="number"
                      value={formData.subject1Marks || ''}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.subject1Marks ? 'border-destructive' : ''
                      }`}
                      placeholder="0-100"
                    />
                    {errors.subject1Marks && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.subject1Marks}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject2Name" className="text-foreground font-paragraph">
                      Subject 2 Name
                    </Label>
                    <Input
                      id="subject2Name"
                      name="subject2Name"
                      type="text"
                      value={formData.subject2Name}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.subject2Name ? 'border-destructive' : ''
                      }`}
                      placeholder="e.g., Physics"
                    />
                    {errors.subject2Name && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.subject2Name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject2Marks" className="text-foreground font-paragraph">
                      Subject 2 Marks
                    </Label>
                    <Input
                      id="subject2Marks"
                      name="subject2Marks"
                      type="number"
                      value={formData.subject2Marks || ''}
                      onChange={handleChange}
                      className={`bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal ${
                        errors.subject2Marks ? 'border-destructive' : ''
                      }`}
                      placeholder="0-100"
                    />
                    {errors.subject2Marks && (
                      <p className="text-sm text-destructive font-paragraph">
                        {errors.subject2Marks}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="overallGrade" className="text-foreground font-paragraph">
                      Overall Grade
                    </Label>
                    <Input
                      id="overallGrade"
                      name="overallGrade"
                      type="text"
                      value={formData.overallGrade}
                      onChange={handleChange}
                      className="bg-background border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal"
                      placeholder="e.g., A, B+, C"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="flex-1 border-electric-teal/30 text-foreground hover:bg-electric-teal/10 font-paragraph"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-electric-teal text-primary-foreground hover:scale-105 transition-transform font-paragraph font-semibold"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Student
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
