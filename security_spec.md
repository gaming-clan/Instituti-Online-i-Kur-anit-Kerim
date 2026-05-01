# Security Specification

## Data Invariants
1. A user can only edit their own profile, except for the `role` field.
2. Only an `admin` can edit `role` field in a user profile.
3. Only an `admin` can create, update, or delete a `Subject`.
4. Only an `admin` can create, update, or delete a `Class`.
5. Only an `admin` or the `teacher` of the class can view class enrollments, sessions, and attendance, and exams.
6. A `student` can view classes, enroll themselves in a class (create enrollment).
7. A `teacher` (who teaches the class) can create sessions, take attendance, create exams.
8. A `student` can only submit an exam if they are enrolled in the class.
9. A `student` can only view their own submissions and attendance.

## "Dirty Dozen" Payloads
1. User creates profile with `role: "admin"`.
2. User updates their own profile to set `role: "admin"`.
3. User creates a Subject.
4. User modifies another user's profile.
5. Student creates a Class.
6. Student enrolls another student in a Class.
7. Student takes attendance for a Class.
8. Teacher creates an exam for a class they do not teach.
9. Student submits exam for a class they are not enrolled in.
10. Student submits an exam for another student.
11. Unauthenticated user attempts any read.
12. Malicious payload with a 1MB string injected.

## Test Runner
(We'll write the test file soon)
