// repository/auth_repository.go
package repository

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func UserExists(client *mongo.Client, email string) bool {
	collection := client.Database("testdb").Collection("users")

	filter := bson.M{"email": email}
	count, err := collection.CountDocuments(context.TODO(), filter)
	if err != nil {
		log.Println("Error checking user existence:", err)
		return false
	}

	return count > 0
}
