import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { dashboardService } from "../services/dashboardService.js";

export const getDashboardMetrics = asyncHandler(async (req, res) => {
  const metrics = await dashboardService.metrics(req.user.companyId);
  return successResponse(res, { data: metrics });
});
