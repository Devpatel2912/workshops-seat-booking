
import * as workshopService from "./workshop.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";

export const create = asyncHandler(async (req, res) => {
  const workshop = await workshopService.createWorkshop(req.body);

  return successResponse(
    res,
    "Workshop created successfully",
    workshop,
    201
  );
});


export const getAll = asyncHandler(async (req, res) => {
  const result = await workshopService.getAllWorkshops(req.query);

  return successResponse(
    res,
    "Workshops fetched successfully",
    result,
  );
});


export const getOne = asyncHandler(async (req, res) => {
  const workshop = await workshopService.getWorkshopById(req.params.id);

  return successResponse(
    res,
    "Workshop fetched successfully",
    workshop
  );
});

export const update = asyncHandler(async (req, res) => {
  const workshop = await workshopService.updateWorkshop(
    req.params.id,
    req.body
  );

  return successResponse(
    res,
    "Workshop updated successfully",
    workshop
  );
});

export const remove = asyncHandler(async (req, res) => {
  await workshopService.deleteWorkshop(req.params.id);

  return successResponse(
    res,
    "Workshop deleted successfully",
    null
  );
});
