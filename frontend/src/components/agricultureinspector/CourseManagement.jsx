import React, { useState } from "react";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";

export default function CourseManagement() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleSuccess = () => {
    setEditingCourse(null);
    setRefreshKey((k) => k + 1); // refresh course list
  };

  const handleCancel = () => setEditingCourse(null);

  return (
    <div className="container mx-auto p-4">
      <CourseForm
        key={editingCourse ? editingCourse._id : "new"}
        initialData={editingCourse}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      <CourseList
        key={refreshKey}
        onEditCourse={setEditingCourse}
      />
    </div>
  );
}
