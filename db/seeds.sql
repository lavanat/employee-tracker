INSERT INTO department (department_name)
VALUES ("Finance"),
       ("Sales"),
       ("Product"),
       ("Human Resources"),
       ("Executive");

INSERT INTO work_role (title, salary, department_id)
VALUES ("CEO", 200000,5),
       ("ADR", 50000, 2),
       ("Software Developer", 100000, 3),
       ("HR Assistant", 80000, 4),
       ("HR Manager", 100000, 4),
       ("Accountant", 70000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 1, NULL),
       ("Jane", "Doe", 4, 4),
       ("Lavanya", "Natchiappan", 3, 1),
       ("John", "Meyer", 5, 1),
       ("Emily", "Black", 6, 1);