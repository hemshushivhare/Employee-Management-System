package controller

import (
	"net/http"

	"myginapp/model"
	"myginapp/repository"
	"myginapp/service"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	mongoDB *repository.MongoDB
}

func NewAuthController(mongoDB *repository.MongoDB) *AuthController {
	return &AuthController{
		mongoDB: mongoDB,
	}
}

func (ac *AuthController) SignUp(c *gin.Context) {
	var newUser model.User
	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	// Check if the user already exists in the database
	if repository.UserExists(ac.mongoDB.Client, newUser.Email) {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	// Create new user
	err := service.CreateUser(ac.mongoDB.Client, newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

var jwtSecret = []byte("Hem123")

func (ac *AuthController) Login(c *gin.Context) {
	var loginInfo model.LoginInfo
	if err := c.BindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	user, err := service.Login(ac.mongoDB.Client, loginInfo.Email, loginInfo.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := generateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": user, "token": token})
}

// Generate JWT token with user claims
func generateToken(user model.User) (string, error) {
	// token claims
	claims := jwt.MapClaims{
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
