package service

import (
	"context"
	"errors"
	"io"
	"time"

	"myginapp/model"
	"myginapp/repository"

	// "myginapp/service/auth_service"

	"github.com/cloudinary/cloudinary-go"

	"github.com/cloudinary/cloudinary-go/api/uploader"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrConflict = errors.New("conflict: employee already exists")
	ErrNotFound = errors.New("not found: employee not found")
)

type EmployeeService struct {
	mongoDB *repository.MongoDB
}

func NewEmployeeService(mongoDB *repository.MongoDB) *EmployeeService {
	return &EmployeeService{
		mongoDB: mongoDB,
	}
}

func (es *EmployeeService) GetEmployeeDetails(pageNumber, pageSize int, searchTerm string) ([]model.Employee, error) {
	collection := es.mongoDB.Client.Database("testdb").Collection("employee_details")

	skip := int64((pageNumber - 1) * pageSize)
	limit := int64(pageSize)

	filter := bson.M{"active": true}
	if searchTerm != "" {
		filter["$or"] = []bson.M{
			{"name": primitive.Regex{Pattern: searchTerm, Options: "i"}},
			{"empId": primitive.Regex{Pattern: searchTerm, Options: "i"}},
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

	var employees []model.Employee
	for cursor.Next(context.TODO()) {
		var employee model.Employee
		if err := cursor.Decode(&employee); err != nil {
			return nil, err
		}
		employees = append(employees, employee)
	}

	return employees, nil
}

// Update AddEmployee function to handle image uploads
func (es *EmployeeService) AddEmployee(employee model.Employee, imageFile io.Reader) error {
	// Initialize Cloudinary
	cloudinaryURL := "cloudinary://148864215921866:oHbi6h56ms1s51VRx73Ma1DpE2Q@da1p1kowf"
	ctx := context.Background()
	cloudinary, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return err
	}

	// Upload image to Cloudinary
	uploadResult, err := cloudinary.Upload.Upload(ctx, imageFile, uploader.UploadParams{})
	if err != nil {
		return err
	}

	imageURL := uploadResult.URL // Get the URL of the uploaded image

	collection := es.mongoDB.Client.Database("testdb").Collection("employee_details")

	// Check if an active employee with the same email or empId already exists
	existingFilter := bson.M{
		"$or": []bson.M{
			{"email": employee.Email, "active": true},
			{"empId": employee.EmpID, "active": true},
		},
	}

	existingCount, err := collection.CountDocuments(context.TODO(), existingFilter)
	if err != nil {
		return err
	}

	if existingCount > 0 {
		return ErrConflict
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(employee.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Insert data into MongoDB
	_, err = collection.InsertOne(context.TODO(), bson.M{
		"name":            employee.Name,
		"email":           employee.Email,
		"empId":           employee.EmpID,
		"age":             employee.Age,
		"password":        hashedPassword,
		"department":      employee.Department,
		"role":            employee.Role,
		"mobile":          employee.Mobile,
		"addressType":     employee.AddressType,
		"address":         employee.Address,
		"remainingLeaves": 30,
		"active":          true,
		"imageURL":        imageURL, // Store image URL in the employee details
		"CreatedAt":       time.Now(),
	})

	if err != nil {
		return err
	}

	return nil
}

func (es *EmployeeService) UpdateEmployeeDetails(empID string, updatedEmployee model.Employee) error {
	collection := es.mongoDB.Client.Database("testdb").Collection("employee_details")

	filter := bson.M{"empId": empID}
	update := bson.M{
		"$set": bson.M{
			"name":            updatedEmployee.Name,
			"email":           updatedEmployee.Email,
			"age":             updatedEmployee.Age,
			"password":        updatedEmployee.Password,
			"department":      updatedEmployee.Department,
			"role":            updatedEmployee.Role,
			"mobile":          updatedEmployee.Mobile,
			"addressType":     updatedEmployee.AddressType,
			"address":         updatedEmployee.Address,
			"active":          true,
			"remainingLeaves": updatedEmployee.RemainingLeaves,
		},
	}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return ErrNotFound
	}

	return nil
}

func (es *EmployeeService) DeleteEmployeeDetails(empID string) error {
	collection := es.mongoDB.Client.Database("testdb").Collection("employee_details")

	filter := bson.M{"empId": empID}
	update := bson.M{"$set": bson.M{"active": false}}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return ErrNotFound
	}

	return nil
}

func (es *EmployeeService) GetEmployeeDetailsById(empID string) ([]model.Employee, error) {
	collection := es.mongoDB.Client.Database("testdb").Collection("employee_details")
	filter := bson.M{"empId": empID, "active": true}

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var employees []model.Employee
	for cursor.Next(context.TODO()) {
		var employee model.Employee
		if err := cursor.Decode(&employee); err != nil {
			return nil, err
		}
		employees = append(employees, employee)
	}

	if len(employees) == 0 {
		return nil, ErrNotFound
	}

	return employees, nil
}

func (es *EmployeeService) GetEmployeeDetailsByEmail(email string) ([]model.Employee, error) {
	collection := es.mongoDB.Client.Database("testdb").Collection("employee_details")
	filter := bson.M{"email": email, "active": true}

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var employees []model.Employee
	for cursor.Next(context.TODO()) {
		var employee model.Employee
		if err := cursor.Decode(&employee); err != nil {
			return nil, err
		}
		employees = append(employees, employee)
	}

	if len(employees) == 0 {
		return nil, ErrNotFound
	}

	return employees, nil
}
