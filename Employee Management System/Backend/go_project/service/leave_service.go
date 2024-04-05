package service

import (
	"context"
	"myginapp/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type LeaveRequest struct {
	ID            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	EmployeeID    string             `json:"employeeId" binding:"required"`
	StartDate     string             `json:"startDate" binding:"required"`
	EndDate       string             `json:"endDate" binding:"required"`
	Reason        string             `json:"reason" binding:"required"`
	DaysRequested int                `json:"DaysRequested" binding:"required"`
	LeaveStatus   string             `json:"leaveStatus" binding:"required"`
}

type LeaveRequestService struct {
	mongoDB *repository.MongoDB
}

func NewLeaveRequestService(mongoDB *repository.MongoDB) *LeaveRequestService {
	return &LeaveRequestService{mongoDB: mongoDB}
}

func (lrs *LeaveRequestService) CreateLeaveRequest(leaveRequest *LeaveRequest) error {
	collection := lrs.mongoDB.Client.Database("testdb").Collection("leave_requests")
	_, err := collection.InsertOne(context.TODO(), leaveRequest)
	if err != nil {
		return err
	}
	return nil
}

func (lrs *LeaveRequestService) GetLeaveRequests(pageNumber, pageSize int, searchTerm string) ([]LeaveRequest, error) {
	collection := lrs.mongoDB.Client.Database("testdb").Collection("leave_requests")

	skip := int64((pageNumber - 1) * pageSize)
	limit := int64(pageSize)

	filter := bson.M{}
	if searchTerm != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"employeeid": primitive.Regex{Pattern: searchTerm, Options: "i"}},
				{"leaveStatus": primitive.Regex{Pattern: searchTerm, Options: "i"}},
			},
		}
	}

	cursor, err := collection.Find(context.TODO(), filter, &options.FindOptions{
		Limit: &limit,
		Skip:  &skip,
	})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var leaveRequests []LeaveRequest
	for cursor.Next(context.TODO()) {
		var leaveRequest LeaveRequest
		if err := cursor.Decode(&leaveRequest); err != nil {
			return nil, err
		}

		leaveRequests = append(leaveRequests, leaveRequest)
	}

	return leaveRequests, nil
}

func (lrs *LeaveRequestService) UpdateLeaveStatus(leaveID string, newStatus string) error {
	oid, err := primitive.ObjectIDFromHex(leaveID)
	if err != nil {
		return err
	}

	collection := lrs.mongoDB.Client.Database("testdb").Collection("leave_requests")

	filter := bson.M{"_id": oid}
	update := bson.M{"$set": bson.M{"leaveStatus": newStatus}}

	_, err = collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	return nil
}
