import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Search,
  Plus,
  LogOut,
  User,
  GraduationCap,
  Edit,
  Trash2,
  Calendar,
  Mail,
  BookOpen,
  TrendingUp,
  Users,
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { StudentRecords } from '@/entities';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRecords[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentRecords[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const user = localStorage.getItem('username');

    if (!role || !user) {
      navigate('/');
      return;
    }

    setUserRole(role);
    setUsername(user);
    loadStudents();
  }, [navigate]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const { items } = await BaseCrudService.getAll<StudentRecords>('studentrecords');
      setStudents(items);
      setFilteredStudents(items);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.studentName?.toLowerCase().includes(query) ||
          student.semester?.toLowerCase().includes(query) ||
          student.rollNumber?.toString().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    if (userRole !== 'admin') return;

    if (confirm('Are you sure you want to delete this student record?')) {
      try {
        await BaseCrudService.delete('studentrecords', id);
        await loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const calculateAttendancePercentage = (attended?: number, total?: number) => {
    if (!attended || !total || total === 0) return 0;
    return Math.round((attended / total) * 100);
  };

  const getGradeColor = (grade?: string) => {
    if (!grade) return 'text-foreground/50';
    const upperGrade = grade.toUpperCase();
    if (upperGrade === 'A' || upperGrade === 'A+') return 'text-electric-teal';
    if (upperGrade === 'B' || upperGrade === 'B+') return 'text-secondary';
    return 'text-foreground/70';
  };

  const stats = {
    total: students.length,
    avgAttendance: students.length
      ? Math.round(
          students.reduce(
            (acc, s) => acc + calculateAttendancePercentage(s.classesAttended, s.totalClasses),
            0
          ) / students.length
        )
      : 0,
    highPerformers: students.filter((s) => s.overallGrade?.toUpperCase().startsWith('A')).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-deep-space-blue border-b border-electric-teal/20 sticky top-0 z-50">
        <div className="max-w-[100rem] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GraduationCap className="w-10 h-10 text-electric-teal" />
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Student Dashboard
                </h1>
                <p className="text-sm font-paragraph text-foreground/60">
                  {userRole === 'admin' ? 'Administrator Panel' : 'Viewer Mode'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-electric-teal/20">
                <User className="w-4 h-4 text-electric-teal" />
                <span className="text-sm font-paragraph text-foreground">{username}</span>
                <span className="text-xs font-paragraph text-foreground/50 ml-2 px-2 py-1 bg-electric-teal/10 rounded">
                  {userRole}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-electric-teal/30 text-foreground hover:bg-electric-teal/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[100rem] mx-auto px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-deep-space-blue border border-electric-teal/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-paragraph text-foreground/60 mb-1">Total Students</p>
                  <p className="text-4xl font-heading font-bold text-electric-teal">
                    {stats.total}
                  </p>
                </div>
                <Users className="w-12 h-12 text-electric-teal/30" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-deep-space-blue border border-electric-teal/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-paragraph text-foreground/60 mb-1">Avg Attendance</p>
                  <p className="text-4xl font-heading font-bold text-secondary">
                    {stats.avgAttendance}%
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-secondary/30" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-deep-space-blue border border-electric-teal/20 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-paragraph text-foreground/60 mb-1">
                    High Performers
                  </p>
                  <p className="text-4xl font-heading font-bold text-electric-teal">
                    {stats.highPerformers}
                  </p>
                </div>
                <GraduationCap className="w-12 h-12 text-electric-teal/30" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-electric-teal" />
            <Input
              type="text"
              placeholder="Search by name, semester, or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-deep-space-blue border-electric-teal/30 text-foreground font-paragraph focus:border-electric-teal h-12"
            />
          </div>

          {userRole === 'admin' && (
            <Button
              onClick={() => navigate('/add-student')}
              className="bg-electric-teal text-primary-foreground hover:scale-105 transition-transform font-paragraph font-semibold h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Student
            </Button>
          )}
        </div>

        {/* Students Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-electric-teal/30 border-t-electric-teal rounded-full animate-spin" />
            <p className="mt-4 text-foreground/60 font-paragraph">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <Card className="bg-deep-space-blue border border-electric-teal/20 p-16 text-center">
            <GraduationCap className="w-16 h-16 text-electric-teal/30 mx-auto mb-4" />
            <p className="text-lg font-paragraph text-foreground/60">
              {searchQuery ? 'No students found matching your search' : 'No student records yet'}
            </p>
            {userRole === 'admin' && !searchQuery && (
              <Button
                onClick={() => navigate('/add-student')}
                className="mt-6 bg-electric-teal text-primary-foreground hover:scale-105 transition-transform font-paragraph"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Student
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-deep-space-blue border border-electric-teal/20 p-6 hover:border-electric-teal/50 transition-all hover:shadow-lg hover:shadow-electric-teal/10 group">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                          {student.studentName || 'N/A'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm font-paragraph text-foreground/60">
                          <span>Roll: {student.rollNumber || 'N/A'}</span>
                          <span>•</span>
                          <span>{student.semester || 'N/A'}</span>
                        </div>
                      </div>
                      <div
                        className={`text-3xl font-heading font-bold ${getGradeColor(
                          student.overallGrade
                        )}`}
                      >
                        {student.overallGrade || '-'}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 py-4 border-y border-electric-teal/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-electric-teal" />
                        <div>
                          <p className="text-xs font-paragraph text-foreground/50">DOB</p>
                          <p className="text-sm font-paragraph text-foreground">
                            {student.dateOfBirth
                              ? new Date(student.dateOfBirth).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-electric-teal" />
                        <div>
                          <p className="text-xs font-paragraph text-foreground/50">Email</p>
                          <p className="text-sm font-paragraph text-foreground truncate">
                            {student.emailAddress || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Attendance */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-paragraph text-foreground/60">
                          Attendance
                        </span>
                        <span className="text-sm font-paragraph font-semibold text-electric-teal">
                          {calculateAttendancePercentage(
                            student.classesAttended,
                            student.totalClasses
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${calculateAttendancePercentage(
                              student.classesAttended,
                              student.totalClasses
                            )}%`,
                          }}
                          transition={{ duration: 0.8, delay: index * 0.05 }}
                          className="h-full bg-electric-teal rounded-full"
                        />
                      </div>
                      <p className="text-xs font-paragraph text-foreground/50 mt-1">
                        {student.classesAttended || 0} / {student.totalClasses || 0} classes
                      </p>
                    </div>

                    {/* Subjects */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-electric-teal" />
                        <span className="text-sm font-paragraph text-foreground/60">Subjects</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {student.subject1Name && (
                          <div className="bg-background/50 rounded p-2">
                            <p className="text-xs font-paragraph text-foreground/50">
                              {student.subject1Name}
                            </p>
                            <p className="text-lg font-heading font-bold text-electric-teal">
                              {student.subject1Marks || 0}
                            </p>
                          </div>
                        )}
                        {student.subject2Name && (
                          <div className="bg-background/50 rounded p-2">
                            <p className="text-xs font-paragraph text-foreground/50">
                              {student.subject2Name}
                            </p>
                            <p className="text-lg font-heading font-bold text-electric-teal">
                              {student.subject2Marks || 0}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {userRole === 'admin' && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => navigate(`/edit-student/${student._id}`)}
                          className="flex-1 bg-electric-teal/10 text-electric-teal hover:bg-electric-teal hover:text-primary-foreground transition-all font-paragraph"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(student._id)}
                          variant="outline"
                          className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all font-paragraph"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-deep-space-blue border-t border-electric-teal/20 mt-16">
        <div className="max-w-[100rem] mx-auto px-8 py-6">
          <p className="text-center text-sm font-paragraph text-foreground/50">
            © 2025 Student Dashboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
