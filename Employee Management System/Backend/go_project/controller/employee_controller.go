package controller

import (
	"bytes"
	"errors"
	"io/ioutil"
	"myginapp/model"
	"myginapp/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Define custom error values
var ErrConflict = errors.New("conflict: employee already exists")
var ErrNotFound = errors.New("not found: employee not found")
var (
	ErrInvalidParam = errors.New("invalid parameter")
)

type EmployeeController struct {
	employeeService *service.EmployeeService
}

func NewEmployeeController(employeeService *service.EmployeeService) *EmployeeController {
	return &EmployeeController{
		employeeService: employeeService,
	}
}

func (ec *EmployeeController) GetEmployeeDetails(c *gin.Context) {
	pageSizeStr := c.DefaultQuery("pageSize", "6")
	pageNumberStr := c.DefaultQuery("pageNumber", "1")
	searchTerm := c.DefaultQuery("searchTerm", "")

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": ErrInvalidParam.Error()})
		return
	}

	pageNumber, err := strconv.Atoi(pageNumberStr)
	if err != nil || pageNumber <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": ErrInvalidParam.Error()})
		return
	}

	employees, err := ec.employeeService.GetEmployeeDetails(pageNumber, pageSize, searchTerm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve employee details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee details retrieved successfully", "data": employees})
}

func (ec *EmployeeController) AddEmployee(c *gin.Context) {
	// Parse form fields
	err := c.Request.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse form"})
		return
	}

	// Retrieve form values
	empName := c.Request.FormValue("name")
	empEmail := c.Request.FormValue("email")
	empID := c.Request.FormValue("empId")
	empAgeStr := c.Request.FormValue("age")
	empPassword := c.Request.FormValue("password")
	empDepartment := c.Request.FormValue("department")
	empRole := c.Request.FormValue("role")
	empMobile := c.Request.FormValue("mobile")
	empAddressType := c.Request.FormValue("addressType")
	empAddress := c.Request.FormValue("address")

	// Create employee object
	empAge, err := strconv.Atoi(empAgeStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid age"})
		return
	}
	employee := model.Employee{
		Name:        empName,
		Email:       empEmail,
		EmpID:       empID,
		Age:         empAge,
		Password:    empPassword,
		Department:  empDepartment,
		Role:        empRole,
		Mobile:      empMobile,
		AddressType: empAddressType,
		Address:     empAddress,
	}

	// Retrieve file from request
	file, _, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}
	defer file.Close()

	// Read file content
	fileContent, err := ioutil.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	// Pass the file content to the AddEmployee function
	err = ec.employeeService.AddEmployee(employee, bytes.NewReader(fileContent))
	if err != nil {
		if err == ErrConflict {
			c.JSON(http.StatusConflict, gin.H{"error": "Employee with the same email or empId already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee added successfully"})
}

func (ec *EmployeeController) UpdateEmployeeDetails(c *gin.Context) {
	empID := c.Param("empId")

	var updatedEmployee model.Employee
	if err := c.BindJSON(&updatedEmployee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	err := ec.employeeService.UpdateEmployeeDetails(empID, updatedEmployee)
	if err != nil {
		if err == ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee details updated successfully"})
}

func (ec *EmployeeController) DeleteEmployeeDetails(c *gin.Context) {
	empID := c.Param("empId")

	err := ec.employeeService.DeleteEmployeeDetails(empID)
	if err != nil {
		if err == ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee details marked as inactive"})
}

func (ec *EmployeeController) GetEmployeeDetailsById(c *gin.Context) {
	empID := c.Param("empId")

	employees, err := ec.employeeService.GetEmployeeDetailsById(empID)
	if err != nil {
		if err == ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve employee details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee details retrieved successfully", "data": employees})
}

func (ec *EmployeeController) GetEmployeeDetailsByEmail(c *gin.Context) {
	email := c.Param("email")

	employees, err := ec.employeeService.GetEmployeeDetailsByEmail(email)
	if err != nil {
		if err == ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve employee details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Employee details retrieved successfully", "data": employees})
}
