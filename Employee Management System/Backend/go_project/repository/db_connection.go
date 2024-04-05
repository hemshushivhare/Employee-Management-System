// repository/mongodb.go
package repository

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoDB represents the MongoDB client.
type MongoDB struct {
	Client *mongo.Client
}

// InitMongoDB initializes and returns a new MongoDB client.
func InitMongoDB() *MongoDB {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017").SetConnectTimeout(10 * time.Second)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	return &MongoDB{
		Client: client,
	}
}
