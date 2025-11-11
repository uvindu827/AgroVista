import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";

export default function CreativeCourseCarousel({ courses, onEdit, onDelete, onStripe, onRestore }) {
  return (
    <div style={{ width: "100%", padding: "32px 0" }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={32}
        slidesPerView={1}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: "48px" }}
      >
        {courses.map((course) => (
          <SwiperSlide key={course._id}>
            <div
              style={{
                background: "rgba(255,255,255,0.92)",
                borderRadius: "32px",
                boxShadow: "0 8px 32px rgba(34,197,94,0.14)",
                border: "2px solid #38b2ac",
                overflow: "hidden",
                transition: "transform 0.3s",
                position: "relative",
                minHeight: "420px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              className="hover:scale-105"
            >
              {course.imageUrl && (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover",
                    borderTopLeftRadius: "32px",
                    borderTopRightRadius: "32px",
                  }}
                />
              )}
              <div style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "bold", color: "#22c55e", marginBottom: "10px" }}>
                  {course.title}
                </h3>
                <p style={{ color: "#166534", fontSize: "1rem", marginBottom: "14px", lineHeight: "1.6" }}>
                  {course.description}
                </p>
                <ul style={{ color: "#0f766e", fontSize: "0.98rem", marginBottom: "18px", listStyle: "none", padding: 0 }}>
                  <li><strong>Fee:</strong> Rs. {course.coursefee}</li>
                  <li><strong>Dates:</strong> {course.startingdate} → {course.enddate}</li>
                  <li><strong>Coordinator:</strong> {course.coordinator}</li>
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                  {!course.deleted ? (
                    <>
                      <button onClick={() => onEdit(course)} style={{ background: "linear-gradient(90deg, #38b2ac 0%, #22c55e 100%)", color: "#fff", fontWeight: "bold", fontSize: "1rem", padding: "8px 20px", borderRadius: "999px", border: "none", boxShadow: "0 2px 8px rgba(34,197,94,0.10)", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => onDelete(course._id)} style={{ background: "linear-gradient(90deg, #ef4444 0%, #f59e42 100%)", color: "#fff", fontWeight: "bold", fontSize: "1rem", padding: "8px 20px", borderRadius: "999px", border: "none", boxShadow: "0 2px 8px rgba(239,68,68,0.10)", cursor: "pointer" }}>Delete</button>
                      {course.title.toLowerCase().includes("agriculture inspector") && (
                        <button onClick={() => onStripe(course._id)} style={{ background: "linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)", color: "#fff", fontWeight: "bold", fontSize: "1rem", padding: "8px 20px", borderRadius: "999px", border: "none", boxShadow: "0 2px 8px rgba(124,58,237,0.10)", cursor: "pointer" }}>Pay with Stripe</button>
                      )}
                    </>
                  ) : (
                    <button onClick={() => onRestore(course._id)} style={{ background: "linear-gradient(90deg, #fde68a 0%, #fbbf24 100%)", color: "#fff", fontWeight: "bold", fontSize: "1rem", padding: "8px 20px", borderRadius: "999px", border: "none", boxShadow: "0 2px 8px rgba(251,191,36,0.10)", cursor: "pointer" }}>Restore</button>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
