const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'work_db'
    }
);

const mainMenu = () => {
    const menuQ = [
        {
            type: 'list',
            name: 'menu',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit'],
            message: 'What would you like to do?',
        }
    ];
    inquirer
        .prompt(menuQ)
        .then((answers) => {
            switch (answers.menu) {
                case 'View all departments':
                    viewDepartment();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                default:
                    console.log('Exiting...');
                    break;
            }
        });
};

const viewDepartment = () => {
    db.query('SELECT * FROM departments', function (err, results) {
        console.log("\n")
        console.table(results)
        console.log("\n")
        mainMenu();
    });
};

const viewRoles = () => {
    const sql = 'SELECT work_roles.id, work_roles.title, departments.department_name, work_roles.salary FROM work_roles LEFT JOIN departments ON work_roles.department_id = departments.id';
    db.query(sql, function (err, results) {
        console.log("\n")
        console.table(results)
        console.log("\n")
        mainMenu();
    });
};

const viewEmployees = () => {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, work_roles.title, departments.department_name AS department, work_roles.salary, Concat(manager.first_name," ", manager.last_name) AS manager FROM employees employee LEFT JOIN work_roles ON employee.role_id = work_roles.id LEFT JOIN departments ON work_roles.department_id = departments.id LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id';
    db.query(sql, function (err, results) {
        console.log("\n")
        console.table(results)
        console.log("\n")
        mainMenu();
    });
};

const addDepartment = () => {
    const question = [
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?',
        }
    ];
    inquirer
        .prompt(question)
        .then((answers) => {
            const sql = 'INSERT INTO departments (department_name) VALUES (?)';
            db.query(sql, answers.department, (err, results) => {
                console.log(`\n Added ${answers.department} to the department table.`);
                viewDepartment();
            });
        });
};

const addRole = () => {
    var departmentList
    db.query('SELECT department_name FROM departments', function (err, results) {
        departmentList = results.map((result) => {
            return result.department_name;
        });
        const questions = [
            {
                type: 'input',
                name: 'role',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                choices: departmentList,
                message: 'Which department does the role belong to?',
            }
        ];
        inquirer
            .prompt(questions)
            .then((answers) => {
                const sql = 'INSERT INTO work_roles (title, salary, department_id) VALUES (?,?,?)';
                var departmentID
                db.query(`SELECT id FROM departments WHERE department_name = "${answers.department}"`, function (err, results) {
                    departmentID = results.map((result) => {
                        return result.id;
                    });
                    db.query(sql, [answers.role, answers.salary, departmentID[0]], (err, results) => {
                        console.log(`\n Added ${answers.role} to the role table.`);
                        viewRoles();
                    });
                });
            });
    });
};


const addEmployee = () => {
    db.query("SELECT id, title FROM work_roles", function (err, results) {
        const rolesList = results.map(role => ({
            name: role.title,
            value: role.id,
        }));
        db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function (err, results) {
            const managersList = results.map(manager => ({
                name: manager.name,
                value: manager.id,
            }));
            const questions = [
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?",
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?",
                },
                {
                    type: 'list',
                    name: 'role',
                    choices: rolesList,
                    message: "What is the employee's role?",
                },
                {
                    type: 'list',
                    name: 'manager',
                    choices: managersList,
                    message: "Who is the employee's manager?",
                }
            ];
            inquirer
                .prompt(questions)
                .then((answers) => {
                    const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
                    db.query(sql, [answers.first_name, answers.last_name, answers.role, answers.manager], (err, results) => {
                        console.log(`\n Added ${answers.first_name} ${answers.last_name} to the employees table.`);
                        viewEmployees();
                    });

                });
        });
    });
};

const updateEmployeeRole = () => {
    db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function (err, results) {
        const employeeList = results.map(employee => ({
            name: employee.name,
            value: employee.id,
        }));
        db.query("SELECT id, title FROM work_roles", function (err, results) {
            const rolesList = results.map(role => ({
                name: role.title,
                value: role.id,
            }));
            const questions = [
                {
                    type: 'list',
                    name: 'employee',
                    choices: employeeList,
                    message: "Which employee do you want to update?",
                },
                {
                    type: 'list',
                    name: 'role',
                    choices: rolesList,
                    message: "Which role do you want to assign the employee?",
                }
            ];
            inquirer
                .prompt(questions)
                .then((answers) => {
                    const sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
                    db.query(sql, [answers.role, answers.employee], (err, results) => {
                        console.log(`\n Updated their role in the employees table.`);
                        viewEmployees();
                    });

                });
        });
    });
};

const init = () => {
        console.log("Welcome to the Employee Manager Application! \n ----------------- \n");
        mainMenu();
    };

    init();