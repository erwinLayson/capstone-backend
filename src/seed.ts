import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { ResultSetHeader } from "mysql2/promise";
import { getDBPoolConnection } from "./config/database";

// Helper: coerce values to mysql-compatible array
function sql(...args: (string | number | null | undefined)[]): (string | number | null)[] {
  return args.map((v) => (v === undefined ? null : v));
}

async function seed() {
  const pool = getDBPoolConnection();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ──────────────────────────────────────────────────────
    // 1. Clear existing data (reverse dependency order)
    // ──────────────────────────────────────────────────────
    console.log("Clearing existing data...");
    await connection.execute("DELETE FROM class_subjects");
    await connection.execute("DELETE FROM enrollment_details");
    await connection.execute("DELETE FROM class_students");
    await connection.execute("DELETE FROM enrollments");
    await connection.execute("DELETE FROM teacher_subject_assignment");
    await connection.execute("DELETE FROM class_teacher");
    await connection.execute("DELETE FROM classrooms");
    await connection.execute("DELETE FROM subjects");
    await connection.execute("DELETE FROM students");
    await connection.execute("DELETE FROM teachers");
    await connection.execute("DELETE FROM users");
    await connection.execute("DELETE FROM schoolyear");
    await connection.execute("DELETE FROM school_info");

    // ──────────────────────────────────────────────────────
    // 2. Users (1 admin + 10 teachers + 10 students = 21)
    // ──────────────────────────────────────────────────────
    console.log("Seeding users...");
    const hash = await bcrypt.hash("password123", 10);

    await connection.execute(
      "INSERT INTO users(email, password, role) VALUES(?,?,?)",
      sql("admin@gradesync.edu", hash, "admin")
    );

    const teacherEmails: string[] = [
      "juan.delacruz@gradesync.edu",
      "maria.santos@gradesync.edu",
      "carlos.reyes@gradesync.edu",
      "ana.gonzales@gradesync.edu",
      "pedro.ramos@gradesync.edu",
      "luz.villanueva@gradesync.edu",
      "miguel.angeles@gradesync.edu",
      "rosa.lopez@gradesync.edu",
      "antonio.flores@gradesync.edu",
      "elena.garcia@gradesync.edu",
    ];
    const teacherUserIds: number[] = [];
    for (const email of teacherEmails) {
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO users(email, password, role) VALUES(?,?,?)",
        sql(email, hash, "teacher")
      );
      teacherUserIds.push(result.insertId);
    }

    const studentEmails: string[] = [
      "alex.garcia@student.edu",
      "beatriz.mercado@student.edu",
      "carlo.mendoza@student.edu",
      "diana.lorenzo@student.edu",
      "eduardo.silva@student.edu",
      "francesca.cruz@student.edu",
      "gabriel.torres@student.edu",
      "hannah.aguilar@student.edu",
      "ivan.delossantos@student.edu",
      "jasmine.romero@student.edu",
    ];
    const studentUserIds: number[] = [];
    for (const email of studentEmails) {
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO users(email, password, role) VALUES(?,?,?)",
        sql(email, hash, "student")
      );
      studentUserIds.push(result.insertId);
    }

    // ──────────────────────────────────────────────────────
    // 3. Teachers (10)
    // ──────────────────────────────────────────────────────
    console.log("Seeding teachers...");
    const teacherData = [
      { firstname: "Juan", middlename: "M.", lastname: "Dela Cruz", suffix: null },
      { firstname: "Maria", middlename: "L.", lastname: "Santos", suffix: null },
      { firstname: "Carlos", middlename: "R.", lastname: "Reyes", suffix: "Jr." },
      { firstname: "Ana", middlename: "P.", lastname: "Gonzales", suffix: null },
      { firstname: "Pedro", middlename: "S.", lastname: "Ramos", suffix: null },
      { firstname: "Luz", middlename: "T.", lastname: "Villanueva", suffix: null },
      { firstname: "Miguel", middlename: "D.", lastname: "Angeles", suffix: "III" },
      { firstname: "Rosa", middlename: "C.", lastname: "Lopez", suffix: null },
      { firstname: "Antonio", middlename: "B.", lastname: "Flores", suffix: null },
      { firstname: "Elena", middlename: "G.", lastname: "Garcia", suffix: null },
    ];
    const teacherIds: number[] = [];
    for (let i = 0; i < teacherData.length; i++) {
      const t = teacherData[i]!;
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO teachers(email, firstname, middlename, lastname, suffix, userId) VALUES(?,?,?,?,?,?)",
        sql(teacherEmails[i]!, t.firstname, t.middlename, t.lastname, t.suffix, teacherUserIds[i]!)
      );
      teacherIds.push(result.insertId);
    }

    // ──────────────────────────────────────────────────────
    // 4. Students (10)
    // ──────────────────────────────────────────────────────
    console.log("Seeding students...");
    const studentData = [
      { lrn: "123456789001", firstname: "Alex", middlename: "R.", lastname: "Garcia", suffix: null, birthdate: "2008-03-15", sex: "Male" },
      { lrn: "123456789002", firstname: "Beatriz", middlename: "S.", lastname: "Mercado", suffix: null, birthdate: "2009-07-22", sex: "Female" },
      { lrn: "123456789003", firstname: "Carlo", middlename: "T.", lastname: "Mendoza", suffix: null, birthdate: "2008-11-02", sex: "Male" },
      { lrn: "123456789004", firstname: "Diana", middlename: "L.", lastname: "Lorenzo", suffix: null, birthdate: "2009-01-14", sex: "Female" },
      { lrn: "123456789005", firstname: "Eduardo", middlename: "V.", lastname: "Silva", suffix: null, birthdate: "2008-05-30", sex: "Male" },
      { lrn: "123456789006", firstname: "Francesca", middlename: "M.", lastname: "Cruz", suffix: null, birthdate: "2009-09-18", sex: "Female" },
      { lrn: "123456789007", firstname: "Gabriel", middlename: "N.", lastname: "Torres", suffix: "II", birthdate: "2008-12-25", sex: "Male" },
      { lrn: "123456789008", firstname: "Hannah", middlename: "P.", lastname: "Aguilar", suffix: null, birthdate: "2009-04-08", sex: "Female" },
      { lrn: "123456789009", firstname: "Ivan", middlename: "Q.", lastname: "Delos Santos", suffix: null, birthdate: "2008-08-19", sex: "Male" },
      { lrn: "123456789010", firstname: "Jasmine", middlename: "R.", lastname: "Romero", suffix: null, birthdate: "2009-06-05", sex: "Female" },
    ];
    const studentIds: number[] = [];
    for (let i = 0; i < studentData.length; i++) {
      const s = studentData[i]!;
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO students(userId, lrn, email, firstname, middlename, lastname, suffix, birthdate, sex) VALUES(?,?,?,?,?,?,?,?,?)",
        sql(studentUserIds[i]!, s.lrn, studentEmails[i]!, s.firstname, s.middlename, s.lastname, s.suffix, s.birthdate, s.sex)
      );
      studentIds.push(result.insertId);
    }

    // ──────────────────────────────────────────────────────
    // 5. Subjects (12)
    // ──────────────────────────────────────────────────────
    console.log("Seeding subjects...");
    const subjectData = [
      { name: "Mathematics", code: "MATH101", unit: 3 },
      { name: "English", code: "ENG101", unit: 3 },
      { name: "Science", code: "SCI101", unit: 3 },
      { name: "Filipino", code: "FIL101", unit: 3 },
      { name: "Araling Panlipunan", code: "AP101", unit: 2 },
      { name: "Values Education", code: "VAL101", unit: 2 },
      { name: "MAPEH", code: "MAPEH101", unit: 2 },
      { name: "Technology and Livelihood Education", code: "TLE101", unit: 2 },
      { name: "Computer Science", code: "CS101", unit: 3 },
      { name: "Science 2 - Chemistry", code: "SCI201", unit: 3 },
      { name: "Mathematics 2 - Algebra", code: "MATH201", unit: 3 },
      { name: "English 2 - Literature", code: "ENG201", unit: 3 },
    ];
    const subjectIds: number[] = [];
    for (const subj of subjectData) {
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO subjects(name, code, unit) VALUES(?,?,?)",
        sql(subj.name, subj.code, subj.unit)
      );
      subjectIds.push(result.insertId);
    }

    // ──────────────────────────────────────────────────────
    // 6. Classrooms (10)
    // ──────────────────────────────────────────────────────
    console.log("Seeding classrooms...");
    const classroomData = [
      { section: "Section A - G7", gradeLevel: 7 },
      { section: "Section B - G7", gradeLevel: 7 },
      { section: "Section C - G8", gradeLevel: 8 },
      { section: "Section D - G8", gradeLevel: 8 },
      { section: "Section E - G9", gradeLevel: 9 },
      { section: "Section F - G9", gradeLevel: 9 },
      { section: "Section G - G10", gradeLevel: 10 },
      { section: "Section H - G10", gradeLevel: 10 },
      { section: "Section I - G11", gradeLevel: 11 },
      { section: "Section J - G11", gradeLevel: 11 },
    ];
    const classroomIds: number[] = [];
    for (const c of classroomData) {
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO classrooms(section, gradeLevel) VALUES(?,?)",
        sql(c.section, c.gradeLevel)
      );
      classroomIds.push(result.insertId);
    }

    // ──────────────────────────────────────────────────────
    // 7. schoolyear (10 school years)
    // ──────────────────────────────────────────────────────
    console.log("Seeding schoolyear...");
    const schoolYearData = [
      "2015-2016", "2016-2017", "2017-2018", "2018-2019", "2019-2020",
      "2020-2021", "2021-2022", "2022-2023", "2023-2024", "2024-2025",
    ];
    const schoolYearIds: number[] = [];
    for (const sy of schoolYearData) {
      const parts = sy.split("-");
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO schoolyear(startYear, endYear) VALUES(?,?)",
        sql(parts[0], parts[1])
      );
      schoolYearIds.push(result.insertId);
    }

    // ──────────────────────────────────────────────────────
    // 8. class_teacher (10 — assign each teacher to a classroom)
    // ──────────────────────────────────────────────────────
    console.log("Seeding class_teacher (advisers)...");
    for (let i = 0; i < Math.min(teacherIds.length, classroomIds.length); i++) {
      await connection.execute(
        "INSERT INTO class_teacher(teacherId, classId) VALUES(?,?)",
        sql(teacherIds[i]!, classroomIds[i]!)
      );
    }

    // ──────────────────────────────────────────────────────
    // 9. teacher_subject_assignment (15 assignments)
    // ──────────────────────────────────────────────────────
    console.log("Seeding teacher_subject_assignment...");
    const tsaPlan: [number, number[]][] = [
      [0, [0, 1]],   // Math → Juan, Maria
      [1, [1, 2]],   // English → Maria, Carlos
      [2, [3]],      // Science → Ana
      [3, [4]],      // Filipino → Pedro
      [4, [5]],      // AP → Luz
      [5, [6]],      // Values → Miguel
      [6, [7]],      // MAPEH → Rosa
      [7, [8]],      // TLE → Antonio
      [8, [9, 0]],   // CS → Elena, Juan
      [9, [3]],      // Chemistry → Ana
      [10, [0]],     // Algebra → Juan
      [11, [2]],     // Literature → Carlos
    ];
    // tsaIds maps [subjectIndex] → array of TSA insertIds
    const tsaIds: number[][] = subjectIds.map(() => []);
    for (const [subjIdx, teacherIdxs] of tsaPlan) {
      for (const teachIdx of teacherIdxs) {
        const [result] = await connection.execute<ResultSetHeader>(
          "INSERT INTO teacher_subject_assignment(teacherId, subjectId) VALUES(?,?)",
          sql(teacherIds[teachIdx]!, subjectIds[subjIdx]!)
        );
        const list = tsaIds[subjIdx];
        if (list) list.push(result.insertId);
      }
    }

    // ──────────────────────────────────────────────────────
    // 10. enrollments (10 — one per student)
    //     Columns: id, dateEnrolled, classId, schoolYearId, studentId
    // ──────────────────────────────────────────────────────
    console.log("Seeding enrollments...");
    const enrollmentIds: number[] = [];
    for (let i = 0; i < studentIds.length; i++) {
      const ci = i % 5; // distribute across first 5 classrooms
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO enrollments(dateEnrolled, classId, schoolYearId, studentId) VALUES(CURDATE(),?,?,?)",
        sql(classroomIds[ci]!, schoolYearIds[0]!, studentIds[i]!)
      );
      enrollmentIds.push(result.insertId);
    }

    // ──────────────────────────────────────────────────────
    // 11. class_students (10 — link enrollments to classrooms)
    // ──────────────────────────────────────────────────────
    console.log("Seeding class_students...");
    for (let i = 0; i < enrollmentIds.length; i++) {
      const ci = i % 5;
      await connection.execute(
        "INSERT INTO class_students(classId, enrollmentId) VALUES(?,?)",
        sql(classroomIds[ci]!, enrollmentIds[i]!)
      );
    }

    // ──────────────────────────────────────────────────────
    // 12. class_subjects — assign teachers+subjects to classrooms
    //     Columns: classId, teacherId, subjectId
    //     UNIQUE constraint on (subjectId, teacherId) — each
    //     teacher can only teach a specific subject once.
    //     So we assign one unique (subjectId,teacherId) per classroom.
    // ──────────────────────────────────────────────────────
    console.log("Seeding class_subjects...");
    // Build map: subjectIndex → list of teacherIds for that subject
    const subjectTeachers: number[][] = subjectIds.map(() => []);
    for (const [subjIdx, teacherIdxs] of tsaPlan) {
      const list = subjectTeachers[subjIdx];
      if (list) {
        for (const teachIdx of teacherIdxs) {
          list.push(teacherIds[teachIdx]!);
        }
      }
    }
    // Track which (subjectId, teacherId) pairs have been used
    const usedPairs = new Set<string>();

    // Plan: classroom index → [subject indices to assign]
    const csPlan: [number, number[]][] = [
      [0, [0, 1, 2, 3, 4]],    // Room A → Math, Eng, Sci, Fil, AP
      [1, [0, 1, 5, 6, 7]],    // Room B → Math, Eng, Values, MAPEH, TLE
      [2, [2, 3, 8, 9, 10]],   // Room C → Sci, Fil, CS, Chem, Algebra
      [3, [4, 5, 6, 7, 11]],   // Room D → AP, Values, MAPEH, TLE, Literature
      [4, [0, 1, 8, 9, 10]],   // Room E → Math, Eng, CS, Chem, Algebra
      [5, [2, 3, 4, 5, 6]],    // Room F → Sci, Fil, AP, Values, MAPEH
      [6, [7, 8, 9, 10, 11]],  // Room G → TLE, CS, Chem, Algebra, Literature
      [7, [0, 1, 2, 3, 7]],    // Room H → Math, Eng, Sci, Fil, TLE
      [8, [4, 5, 6, 8, 11]],   // Room I → AP, Values, MAPEH, CS, Literature
      [9, [0, 2, 8, 10, 11]],  // Room J → Math, Sci, CS, Algebra, Literature
    ];

    let csCount = 0;
    for (const [classIdx, subjIdxs] of csPlan) {
      for (const subjIdx of subjIdxs) {
        const availableTeachers = subjectTeachers[subjIdx];
        if (!availableTeachers || availableTeachers.length === 0) continue;

        const sid = subjectIds[subjIdx]!;
        // Find the first teacher for this subject whose (subjectId, teacherId) pair
        // hasn't been used yet
        let assigned = false;
        for (const tid of availableTeachers) {
          const key = `${sid}-${tid}`;
          if (!usedPairs.has(key)) {
            usedPairs.add(key);
            await connection.execute(
              "INSERT INTO class_subjects(classId, teacherId, subjectId) VALUES(?,?,?)",
              sql(classroomIds[classIdx]!, tid, sid)
            );
            csCount++;
            assigned = true;
            break;
          }
        }
        // If no unique (subjectId, teacherId) pair is available,
        // this subject simply can't be assigned to more classrooms
        if (!assigned) {
          console.log(`  ↳ Skipping subjectIdx ${subjIdx} for classroom ${classIdx} (no unused teacher-subject pair left)`);
        }
      }
    }

    // ──────────────────────────────────────────────────────
    // 13. enrollment_details (10 — link enrollments to subjects)
    // ──────────────────────────────────────────────────────
    console.log("Seeding enrollment_details...");
    for (let i = 0; i < enrollmentIds.length; i++) {
      // Each enrollment gets the first 2 subjects from their classroom's plan
      const classIdx = i % 5;
      const planEntry = csPlan.find(([ci]) => ci === classIdx);
      if (planEntry) {
        const [, subjectIdxs] = planEntry;
        // Assign first 2 subjects for this enrollment
        for (let si = 0; si < Math.min(2, subjectIdxs.length); si++) {
          await connection.execute(
            "INSERT INTO enrollment_details(enrollmentId, subjectId) VALUES(?,?)",
            sql(enrollmentIds[i]!, subjectIds[subjectIdxs[si]!]!)
          );
        }
      }
    }

    // ──────────────────────────────────────────────────────
    // 14. school_info (1 record)
    //     Columns: id (auto), schoolId, name, district, division, region
    // ──────────────────────────────────────────────────────
    console.log("Seeding school_info...");
    await connection.execute(
      "INSERT INTO school_info(schoolId, name, district, division, region) VALUES(?,?,?,?,?)",
      sql(12345, "GradeSync National High School", "District I", "City Schools Division", "National Capital Region")
    );

    await connection.commit();

    // ──────────────────────────────────────────────────────
    // Summary
    // ──────────────────────────────────────────────────────
    console.log("\n==========================================");
    console.log("  SEED COMPLETE!");
    console.log("==========================================");
    console.log(`  Users:              21 (1 admin + 10 teachers + 10 students)`);
    console.log(`  Teachers:           ${teacherIds.length}`);
    console.log(`  Students:           ${studentIds.length}`);
    console.log(`  Subjects:           ${subjectIds.length}`);
    console.log(`  Classrooms:         ${classroomIds.length}`);
    console.log(`  Schoolyears:        ${schoolYearIds.length}`);
    console.log(`  class_teacher:      ${Math.min(teacherIds.length, classroomIds.length)} (adviser assignments)`);
    console.log(`  TSA:                ${tsaIds.flat().length} (teacher-subject assignments)`);
    console.log(`  Enrollments:        ${enrollmentIds.length}`);
    console.log(`  class_students:     ${enrollmentIds.length}`);
    console.log(`  class_subjects:     ${csCount} (${csPlan.reduce((sum, [, idxs]) => sum + idxs.length, 0)} planned, ${csPlan.reduce((sum, [, idxs]) => sum + idxs.length, 0) - csCount} skipped due to unique constraint)`);
    console.log(`  enrollment_details: ${enrollmentIds.length * 2}`);
    console.log(`  school_info:        1`);
    console.log("==========================================");
    console.log("  Default password for all users: password123");
    console.log("==========================================\n");

  } catch (err) {
    await connection.rollback();
    console.error("Seed failed, transaction rolled back.", err);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

seed();
