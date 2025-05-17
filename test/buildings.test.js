const request = require('supertest');
const express = require('express');
const app = require('../app'); // We'll need to export the app from app.js

// Mock Dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/buildingModel');
jest.mock('../models/buildingTypeModel');

// Import mocked dependencies
const jwt = require('jsonwebtoken');
const buildingModel = require('../models/buildingModel');
const buildingTypeModel = require('../models/buildingTypeModel');

// Mock JWT verification
const mockUser = { id: 'mock-user-id', role: 'admin' };
jwt.verify.mockImplementation(() => mockUser);

describe('Building Endpoints', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for building creation with all required fields
  describe('POST /buildings', () => {
    it('should create a building when all required fields are provided', async () => {
      // Mock the building type validation
      buildingTypeModel.getBuildingTypeByType.mockResolvedValue([{ building_type: 'Commercial' }]);
      
      // Mock building creation
      buildingModel.createBuilding.mockResolvedValue({ id: 'new-building-id' });

      // Test request body with all required fields
      const reqBody = {
        name: 'Test Building',
        type: 'Commercial',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        address: '123 Test St',
        year_built: 2010,
        cost_per_sqft: 150.50,
        square_footage: 5000,
        description: 'A test building',
        image_url: 'http://example.com/image.jpg'
      };

      const response = await request(app)
        .post('/buildings')
        .set('Authorization', 'Bearer valid-token')
        .send(reqBody);

      // Check status and response
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      
      // Check that model function was called with correct params
      expect(buildingModel.createBuilding).toHaveBeenCalledWith(
        expect.objectContaining(reqBody)
      );
    });

    // Test missing required fields
    it('should return 400 when required fields are missing', async () => {
      // Incomplete request body
      const reqBody = {
        name: 'Test Building',
        type: 'Commercial'
        // Missing other required fields
      };

      const response = await request(app)
        .post('/buildings')
        .set('Authorization', 'Bearer valid-token')
        .send(reqBody);

      // Check status and error message
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', 'Missing required fields');
      expect(response.body).toHaveProperty('missing_fields');
      expect(response.body.missing_fields).toContain('city');
      expect(response.body.missing_fields).toContain('address');
      
      // Model function should not be called
      expect(buildingModel.createBuilding).not.toHaveBeenCalled();
    });

    // Test invalid building type
    it('should return 400 when building type is invalid', async () => {
      // Mock building type validation to return empty array (no matching types)
      buildingTypeModel.getBuildingTypeByType.mockResolvedValue([]);
      
      // Complete request body but with invalid type
      const reqBody = {
        name: 'Test Building',
        type: 'InvalidType',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        address: '123 Test St',
        year_built: 2010,
        cost_per_sqft: 150.50,
        square_footage: 5000,
        description: 'A test building',
        image_url: 'http://example.com/image.jpg'
      };

      const response = await request(app)
        .post('/buildings')
        .set('Authorization', 'Bearer valid-token')
        .send(reqBody);

      // Check status and error message
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error', `Invalid type: ${reqBody.type}. Must match a building_type in building_type_mappings.`);
      
      // Model function should not be called
      expect(buildingModel.createBuilding).not.toHaveBeenCalled();
    });
  });

  // Test for GET buildings
  describe('GET /buildings', () => {
    it('should return all buildings', async () => {
      // Mock return data
      const mockBuildings = [
        { 
          id: 'building-1',
          name: 'Building 1',
          type: 'Commercial'
        },
        {
          id: 'building-2',
          name: 'Building 2',
          type: 'Residential'
        }
      ];
      
      buildingModel.getAllBuildings.mockResolvedValue(mockBuildings);

      const response = await request(app)
        .get('/buildings')
        .set('Authorization', 'Bearer valid-token');

      // Check status and response
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id', 'building-1');
      expect(response.body[1]).toHaveProperty('id', 'building-2');
    });
  });

  // Test for GET building by ID
  describe('GET /buildings/:id', () => {
    it('should return a building when ID exists', async () => {
      const mockBuilding = { 
        id: 'building-1',
        name: 'Building 1',
        type: 'Commercial',
        city: 'Test City',
        state: 'TS'
      };
      
      buildingModel.getBuildingById.mockResolvedValue(mockBuilding);

      const response = await request(app)
        .get('/buildings/building-1')
        .set('Authorization', 'Bearer valid-token');

      // Check status and response
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', 'building-1');
      expect(response.body).toHaveProperty('name', 'Building 1');
    });

    it('should return 404 when building ID does not exist', async () => {
      // Mock empty response 
      buildingModel.getBuildingById.mockResolvedValue(null);

      const response = await request(app)
        .get('/buildings/non-existent-id')
        .set('Authorization', 'Bearer valid-token');

      // Check status
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Building not found');
    });
  });
});
