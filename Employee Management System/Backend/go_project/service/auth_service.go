package service

import (
	"context"
	"errors"

	"myginapp/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(client *mongo.Client, newUser model.User) error {
	collection := client.Database("testdb").Collection("users")
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		return err // Return error if password hashing fails
	}

	_, insertErr := collection.InsertOne(context.TODO(), bson.M{
		"email":    newUser.Email,
		"password": hashedPassword,
		"role":     newUser.Role,
	})
	return insertErr // Return the insert error
}
func Login(client *mongo.Client, email, password string) (model.User, error) {
	collection := client.Database("testdb").Collection("users")

	var user model.User
	err := collection.FindOne(context.TODO(), bson.M{
		"email": email,
	}).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return model.User{}, errors.New("user not found")
		}
		return model.User{}, err
	}

	// Compare the hashed password stored in the database with the provided password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return model.User{}, errors.New("incorrect password")
	}

	return user, nil
}
