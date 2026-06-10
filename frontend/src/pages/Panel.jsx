import AdminPanel from '../components/AdminPanel'
import StudentPanel from '../components/StudentPanel'
import TeacherPanel from '../components/TeacherPanel'
import Navbar from '../components/Navbar'

export default function Panel({ user, onLogout }) {
  if (!user) return null

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      {user.role === 'admin' && <AdminPanel user={user} />}
      {user.role === 'teacher' && <TeacherPanel />}
      {user.role === 'student' && <StudentPanel user={user} />}
    </>
  )
}
