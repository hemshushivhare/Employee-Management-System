package model

type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type LoginInfo struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
