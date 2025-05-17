/**
 * Building Analytics Controller
 * Provides advanced analytics and statistics for buildings
 */
const buildingModel = require('../models/buildingModel');
const { NotFoundError } = require('../middleware/errorHandler');

/**
 * Get analytics summary of all buildings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getBuildingAnalytics = async (req, res, next) => {
  try {
    const buildings = await buildingModel.getAllBuildings();
    
    if (!buildings || !buildings.length) {
      return res.json({
        totalBuildings: 0,
        totalSquareFootage: 0,
        averageCostPerSqft: 0,
        buildingsByType: {},
        buildingsByState: {}
      });
    }

    // Calculate building statistics
    const totalBuildings = buildings.length;
    
    let totalSquareFootage = 0;
    let totalCost = 0;
    let buildingsByType = {};
    let buildingsByState = {};
    let buildingsByYear = {};
    
    // Process each building for analytics
    buildings.forEach(building => {
      // Square footage and cost analytics
      const sqft = Number(building.square_footage) || 0;
      const costPerSqft = Number(building.cost_per_sqft) || 0;
      totalSquareFootage += sqft;
      totalCost += sqft * costPerSqft;
      
      // Building type distribution
      if (building.type) {
        buildingsByType[building.type] = (buildingsByType[building.type] || 0) + 1;
      }
      
      // Geographic distribution
      if (building.state) {
        buildingsByState[building.state] = (buildingsByState[building.state] || 0) + 1;
      }
      
      // Building age distribution
      if (building.year_built) {
        const year = String(building.year_built);
        buildingsByYear[year] = (buildingsByYear[year] || 0) + 1;
      }
    });
    
    // Calculate averages
    const averageCostPerSqft = totalSquareFootage ? (totalCost / totalSquareFootage).toFixed(2) : 0;
    const averageSquareFootage = totalBuildings ? Math.round(totalSquareFootage / totalBuildings) : 0;
    
    res.json({
      totalBuildings,
      totalSquareFootage,
      averageSquareFootage,
      averageCostPerSqft: Number(averageCostPerSqft),
      buildingsByType,
      buildingsByState,
      buildingsByYear,
      estimatedTotalValue: totalCost.toFixed(2)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get buildings filtered by type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getBuildingsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const buildings = await buildingModel.getBuildingsByType(type);
    
    if (!buildings || !buildings.length) {
      return next(new NotFoundError(`No buildings found with type: ${type}`));
    }
    
    res.json(buildings);
  } catch (err) {
    next(err);
  }
};

/**
 * Get buildings statistics by state
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getBuildingsByState = async (req, res, next) => {
  try {
    const { state } = req.params;
    const buildings = await buildingModel.getBuildingsByState(state);
    
    if (!buildings || !buildings.length) {
      return next(new NotFoundError(`No buildings found in state: ${state}`));
    }
    
    // Calculate state-specific analytics
    let totalSquareFootage = 0;
    let totalCost = 0;
    const buildingTypes = {};
    
    buildings.forEach(building => {
      const sqft = Number(building.square_footage) || 0;
      const costPerSqft = Number(building.cost_per_sqft) || 0;
      totalSquareFootage += sqft;
      totalCost += sqft * costPerSqft;
      
      if (building.type) {
        buildingTypes[building.type] = (buildingTypes[building.type] || 0) + 1;
      }
    });
    
    res.json({
      state,
      totalBuildings: buildings.length,
      totalSquareFootage,
      estimatedTotalValue: totalCost.toFixed(2),
      averageBuilding: {
        squareFootage: Math.round(totalSquareFootage / buildings.length),
        costPerSqft: (totalCost / totalSquareFootage).toFixed(2)
      },
      buildingTypes,
      buildings
    });
  } catch (err) {
    next(err);
  }
};
