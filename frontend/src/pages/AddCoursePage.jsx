import CourseForm from "../components/agricultureinspector/CourseForm";

export default function AddCoursePage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Add New Course</h1>
      <CourseForm onSuccess={() => alert("Course added successfully!")} />
    </>
  );
}
