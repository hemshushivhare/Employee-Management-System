// model/employee.go
package model

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Employee struct {
	Name            string    `json:"name"`
	Email           string    `json:"email"`
	EmpID           string    `json:"empId"`
	Age             int       `json:"age"`
	Password        string    `json:"password"`
	Department      string    `json:"department"`
	Role            string    `json:"role"`
	Mobile          string    `json:"mobile"`
	AddressType     string    `json:"addressType"`
	Address         string    `json:"address"`
	RemainingLeaves int       `json:"remainingLeaves"`
	Active          bool      `json:"active"`
	CreatedAt       time.Time `json:"timestamp"`
	ImageURL        string    `json:"imageURL"`
}

type LeaveRequest struct {
	ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	EmployeeId    string             `json:"employeeId" binding:"required"`
	StartDate     string             `json:"startDate" binding:"required"`
	EndDate       string             `json:"endDate" binding:"required"`
	Reason        string             `json:"reason" binding:"required"`
	DaysRequested int                `json:"daysRequested" binding:"required"`
	Timestamp     time.Time          `json:"timestamp"`
}
