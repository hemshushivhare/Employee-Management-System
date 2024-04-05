package controller

import (
	"net/http"
	"strconv"

	"myginapp/service"

	"github.com/gin-gonic/gin"
)

type LeaveRequestController struct {
	leaveRequestService *service.LeaveRequestService
}

func NewLeaveRequestController(leaveRequestService *service.LeaveRequestService) *LeaveRequestController {
	return &LeaveRequestController{leaveRequestService: leaveRequestService}
}

func (lrc *LeaveRequestController) CreateLeaveRequest(c *gin.Context) {
	var leaveRequest service.LeaveRequest

	if err := c.ShouldBindJSON(&leaveRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := lrc.leaveRequestService.CreateLeaveRequest(&leaveRequest); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Leave request stored successfully", "data": leaveRequest})
}

func (lrc *LeaveRequestController) GetLeaveRequests(c *gin.Context) {
	// Extract pagination parameters from query parameters
	pageNumber, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || pageNumber < 1 {
		pageNumber = 1
	}
	pageSize, err := strconv.Atoi(c.DefaultQuery("pageSize", "7"))
	if err != nil || pageSize < 1 {
		pageSize = 7
	}

	// Extract search term from query parameters
	searchTerm := c.DefaultQuery("search", "")

	// Retrieve leave requests from service with pagination and search
	leaveRequests, err := lrc.leaveRequestService.GetLeaveRequests(pageNumber, pageSize, searchTerm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve leave requests"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave requests retrieved successfully", "data": leaveRequests})
}

func (lrc *LeaveRequestController) UpdateLeaveStatus(c *gin.Context) {
	leaveID := c.Param("id")

	var updateStatus struct {
		LeaveStatus string `json:"leaveStatus" binding:"required"`
		EmployeeID  string `json:"employeeId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&updateStatus); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := lrc.leaveRequestService.UpdateLeaveStatus(leaveID, updateStatus.LeaveStatus); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update leave status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave status updated successfully"})
}
