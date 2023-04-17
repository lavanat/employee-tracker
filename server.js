const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password',
    database: 'work_db'
  }
);

const menuQ = [
    {
        type: 'list',
        name: 'menu',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit'],
        message: 'What would you like to do?',
    }
];

const mainMenu = () => {
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
    db.query('SELECT * FROM departments', function (err,results) {
        console.log("\n")
        console.table(results)
        console.log("\n")
        mainMenu();
    });
};

const viewRoles = () => {
    const sql = 'SELECT work_roles.id, work_roles.title, departments.department_name, work_roles.salary FROM work_roles LEFT JOIN departments ON work_roles.department_id = departments.id';
    db.query(sql, function (err,results) {
        console.log("\n")
        console.table(results)
        console.log("\n")
        mainMenu();
    });
};

const viewEmployees = () => {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, work_roles.title, departments.department_name AS department, work_roles.salary, Concat(manager.first_name," ", manager.last_name) AS manager FROM employees employee LEFT JOIN work_roles ON employee.role_id = work_roles.id LEFT JOIN departments ON work_roles.department_id = departments.id LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id';
    db.query(sql, function (err,results) {
        console.log("\n")
        console.table(results)
        console.log("\n")
        mainMenu();
    });
};

const init = () => {
    console.log("Welcome to the Employee Manager Application! \n ----------------- \n");
    mainMenu();
};

init();