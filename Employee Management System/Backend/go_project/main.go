package main

import (
	"fmt"
	"myginapp/controller"
	"myginapp/repository"
	"myginapp/service"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var jwtSecret = []byte("Hem123")

func main() {
	mongoDB := repository.InitMongoDB()
	router := gin.Default()

	// Configure CORS middleware to allow specific headers
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "X-Requested-With", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600,
	}))

	employeeService := service.NewEmployeeService(mongoDB)
	employeeController := controller.NewEmployeeController(employeeService)

	authController := controller.NewAuthController(mongoDB)
	leaveRequestService := service.NewLeaveRequestService(mongoDB)
	leaveRequestController := controller.NewLeaveRequestController(leaveRequestService)

	router.POST("/signup", authController.SignUp)
	router.POST("/login", authController.Login)

	// Protected routes for Employer
	protectedEmployer := router.Group("/")
	protectedCommon := router.Group("/")
	protectedEmployer.Use(Authorize("Employer"))
	{
		protectedEmployer.GET("/get-employee-details", employeeController.GetEmployeeDetails)
		protectedEmployer.POST("/add-employee", employeeController.AddEmployee)
		protectedEmployer.DELETE("/delete-employee-details/:empId", employeeController.DeleteEmployeeDetails)
		protectedEmployer.PATCH("/update-leave-status/:id", leaveRequestController.UpdateLeaveStatus)
	}
	protectedCommon.Use(CommonAuthorize())
	{
		protectedCommon.GET("/get-employee-details/:empId", employeeController.GetEmployeeDetailsById)
		protectedCommon.GET("/get-employee-by-email/:email", employeeController.GetEmployeeDetailsByEmail)
		protectedCommon.PUT("/update-employee-details/:empId", employeeController.UpdateEmployeeDetails)
		protectedCommon.POST("/leave-request", leaveRequestController.CreateLeaveRequest)
		protectedCommon.GET("/leave-requests", leaveRequestController.GetLeaveRequests)
	}

	router.Run(":8080")
}

func Authorize(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
			c.Abort()
			return
		}

		const bearerPrefix = "Bearer "
		if strings.HasPrefix(tokenString, bearerPrefix) {
			tokenString = tokenString[len(bearerPrefix):]
		}
		fmt.Println("Token received:", tokenString)

		// Parse token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: " + err.Error()})
			c.Abort()
			return
		}

		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		// Checking if the role in the token matches the required role
		userRole, ok := claims["role"].(string)
		if !ok || userRole != role {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			c.Abort()
			return
		}
		// Pass the request if the role matches
		c.Next()
	}
}

func CommonAuthorize() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
			c.Abort()
			return
		}

		const bearerPrefix = "Bearer "
		if strings.HasPrefix(tokenString, bearerPrefix) {
			tokenString = tokenString[len(bearerPrefix):]
		}

		fmt.Println("Token received:", tokenString)
		// Parse token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return jwtSecret, nil
		})
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: " + err.Error()})
			c.Abort()
			return
		}
		if !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
