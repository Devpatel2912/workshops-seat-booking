
import * as workshopService from "./workshop.service.js";

export const create = async (req, res) => {
  try {
    const workshop = await workshopService.createWorkshop(req.body);

    return res.status(201).json({
      success: true,
      message: "Workshop created successfully",
      data: workshop,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const workshops = await workshopService.getAllWorkshops();

    return res.status(200).json({
      success: true,
      data: workshops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const workshop = await workshopService.getWorkshopById(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const workshop = await workshopService.updateWorkshop(
      req.params.id,
      { ...req.body }
    );

    return res.status(200).json({
      success: true,
      message: "Workshop updated successfully",
      data: workshop,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    await workshopService.deleteWorkshop(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Workshop deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
