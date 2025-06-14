import * as dfd from "danfojs-node";
import { downloadFile } from "../utils/fileHelper.js";
import fs from "fs";

const AnalyseController = {
  getHead: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readExcel(filePath);

      const head = df.head();
      const jsonData = dfd.toJSON(head, { format: "row" });

      return res.status(200).json({ message: "Success", head: jsonData });
    } catch (error) {
      console.error("Head Error:", error);
      return res
        .status(500)
        .json({ message: "Error getting head", error: error.toString() });
    }
  },

  getTail: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readExcel(filePath);

      const tail = df.tail();
      const jsonData = dfd.toJSON(tail, { format: "row" });

      return res.status(200).json({ message: "Success", tail: jsonData });
    } catch (error) {
      console.error("Tail Error:", error);
      return res
        .status(500)
        .json({ message: "Error getting tail", error: error.toString() });
    }
  },

  getDescribe: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readExcel(filePath);

      const describe = df.describe();
      const jsonData = dfd.toJSON(describe, { format: "row" });

      return res.status(200).json({ message: "Success", describe: jsonData });
    } catch (error) {
      console.error("Describe Error:", error);
      return res
        .status(500)
        .json({ message: "Error getting describe", error: error.toString() });
    }
  },

  // Returns DataFrame info: columns, dtypes, null counts, shape
  getInfo: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readExcel(filePath);
      const info = {
        columns: df.columns,
        dtypes: df.ctypes.values,
        nullCounts: df.isNa().sum().values,
        shape: df.shape,
      };
      return res.status(200).json({ message: "Success", info });
    } catch (error) {
      console.error("Info Error:", error);
      return res
        .status(500)
        .json({ message: "Error getting info", error: error.toString() });
    }
  },

  // Returns null counts per column
  getNullCounts: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readExcel(filePath);
      const nullCounts = df.isNa().sum().values;
      return res.status(200).json({ message: "Success", nullCounts });
    } catch (error) {
      console.error("NullCounts Error:", error);
      return res.status(500).json({
        message: "Error getting null counts",
        error: error.toString(),
      });
    }
  },

  // Returns list of column names
  getColumns: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readExcel(filePath);
      return res.status(200).json({ message: "Success", columns: df.columns });
    } catch (error) {
      console.error("Columns Error:", error);
      return res
        .status(500)
        .json({ message: "Error getting columns", error: error.toString() });
    }
  },
  getView: async (req, res) => {
    const { fileUrl, page = 1, pageSize = 50 } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readExcel(filePath);

      // Calculate pagination
      const totalRows = df.shape[0];
      const start = Math.min((page - 1) * pageSize, totalRows);
      const end = Math.min(start + pageSize, totalRows);

      // If start is greater than or equal to total rows, return empty data
      if (start >= totalRows) {
        return res.status(200).json({
          message: "Success",
          data: {},
          total: totalRows,
          page,
          pageSize,
          start,
          end,
        });
      }

      // Get paginated data
      const paginatedData = df.iloc({ rows: [`${start}:${end}`] });
      const jsonData = dfd.toJSON(paginatedData, { format: "row" });

      return res.status(200).json({
        message: "Success",
        data: jsonData,
        total: totalRows,
        page,
        pageSize,
        start,
        end,
      });
    } catch (error) {
      console.error("View Error:", error);
      return res
        .status(500)
        .json({ message: "Error getting data", error: error.toString() });
    }
  },
};

export default AnalyseController;
