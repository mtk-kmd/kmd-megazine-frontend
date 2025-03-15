import React from 'react'
import Header from './header'
import StudentList from './student-list'

const Students = () => {
  return (
    <div className="container mx-auto flex flex-col gap-y-5 pb-10">
      <Header />
      <StudentList />
    </div>
  )
}

export default Students
