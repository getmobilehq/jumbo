const request = require('supertest');
const express = require('express');
const app = require('../app');

// Mock Dependencies
jest.mock('jsonwebtoken');
jest.mock('../models/buildingModel');

// Import mocked dependencies
const jwt = require('jsonwebtoken');
const buildingModel = require('../models/buildingModel');

// Mock JWT verification
const mockUser = { id: 'mock-user-id', role: 'admin' };
jwt.verify.mockImplementation(() => mockUser);

describe('Building Analytics Endpoints', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for building analytics summary
  describe('GET /building-analytics/summary', () => {
    it('should return analytics summary for all buildings', async () => {
      // Mock building data
      const mockBuildings = [
        { 
          id: 'building-1',
          name: 'Building 1',
          type: 'Commercial',
          square_footage: 5000,
          cost_per_sqft: 250,
          state: 'NY',
          year_built: 2010
        },
        {
          id: 'building-2',
          name: 'Building 2',
          type: 'Residential',
          square_footage: 3000,
          cost_per_sqft: 180,
          state: 'CA',
          year_built: 2015
        }
      ];
      
      buildingModel.getAllBuildings.mockResolvedValue(mockBuildings);

      const response = await request(app)
        .get('/building-analytics/summary')
        .set('Authorization', 'Bearer valid-token');

      // Check status and response structure
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalBuildings', 2);
      expect(response.body).toHaveProperty('totalSquareFootage', 8000);
      expect(response.body).toHaveProperty('buildingsByType');
      expect(response.body.buildingsByType).toHaveProperty('Commercial', 1);
      expect(response.body.buildingsByType).toHaveProperty('Residential', 1);
      expect(response.body).toHaveProperty('buildingsByState');
      expect(response.body).toHaveProperty('averageCostPerSqft');
    });

    it('should handle empty building list', async () => {
      // Mock empty building list
      buildingModel.getAllBuildings.mockResolvedValue([]);

      const response = await request(app)
        .get('/building-analytics/summary')
        .set('Authorization', 'Bearer valid-token');

      // Check status and response structure
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalBuildings', 0);
      expect(response.body).toHaveProperty('totalSquareFootage', 0);
      expect(response.body).toHaveProperty('averageCostPerSqft', 0);
    });
  });

  // Test for buildings by type
  describe('GET /building-analytics/by-type/:type', () => {
    it('should return buildings filtered by type', async () => {
      // Mock buildings data
      const mockBuildings = [
        { 
          id: 'building-1',
          name: 'Building 1',
          type: 'Commercial',
          square_footage: 5000,
          cost_per_sqft: 250
        },
        {
          id: 'building-2',
          name: 'Building 2',
          type: 'Commercial',
          square_footage: 3000,
          cost_per_sqft: 180
        }
      ];
      
      buildingModel.getBuildingsByType.mockResolvedValue(mockBuildings);

      const response = await request(app)
        .get('/building-analytics/by-type/Commercial')
        .set('Authorization', 'Bearer valid-token');

      // Check status and response
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id', 'building-1');
      expect(response.body[1]).toHaveProperty('id', 'building-2');
    });

    it('should return 404 when no buildings of specified type exist', async () => {
      // Mock empty building list
      buildingModel.getBuildingsByType.mockResolvedValue([]);

      const response = await request(app)
        .get('/building-analytics/by-type/UnknownType')
        .set('Authorization', 'Bearer valid-token');

      // Check status and error message
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Resource not found');
    });
  });

  // Test for buildings by state
  describe('GET /building-analytics/by-state/:state', () => {
    it('should return buildings and analytics for specified state', async () => {
      // Mock buildings data
      const mockBuildings = [
        { 
          id: 'building-1',
          name: 'Building 1',
          type: 'Commercial',
          square_footage: 5000,
          cost_per_sqft: 250,
          state: 'NY'
        },
        {
          id: 'building-2',
          name: 'Building 2',
          type: 'Residential',
          square_footage: 3000,
          cost_per_sqft: 180,
          state: 'NY'
        }
      ];
      
      buildingModel.getBuildingsByState.mockResolvedValue(mockBuildings);

      const response = await request(app)
        .get('/building-analytics/by-state/NY')
        .set('Authorization', 'Bearer valid-token');

      // Check status and response structure
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('state', 'NY');
      expect(response.body).toHaveProperty('totalBuildings', 2);
      expect(response.body).toHaveProperty('totalSquareFootage', 8000);
      expect(response.body).toHaveProperty('buildingTypes');
      expect(response.body).toHaveProperty('buildings');
      expect(Array.isArray(response.body.buildings)).toBe(true);
      expect(response.body.buildings).toHaveLength(2);
    });

    it('should return 404 when no buildings in specified state exist', async () => {
      // Mock empty building list
      buildingModel.getBuildingsByState.mockResolvedValue([]);

      const response = await request(app)
        .get('/building-analytics/by-state/ZZ')
        .set('Authorization', 'Bearer valid-token');

      // Check status and error message
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error', 'Resource not found');
    });
  });
});
