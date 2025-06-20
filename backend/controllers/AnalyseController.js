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
      const df = await dfd.readCSV(filePath);

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
      const df = await dfd.readCSV(filePath);

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
      const df = await dfd.readCSV(filePath);

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
      const df = await dfd.readCSV(filePath);
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

  getNullCounts: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readCSV(filePath);
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

  getColumns: async (req, res) => {
    const { fileUrl } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readCSV(filePath);
      return res.status(200).json({ message: "Success", columns: df.columns });
    } catch (error) {
      console.error("Columns Error:", error);
      return res
        .status(500)
        .json({ message: "Error getting columns", error: error.toString() });
    }
  },

  getHistogram: async (req, res) => {
    const { fileUrl, column } = req.body;
    if (!fileUrl || !column)
      return res
        .status(400)
        .json({ message: "fileUrl and column are required" });

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readCSV(filePath);

      if (!df.columns.includes(column)) {
        return res.status(400).json({ message: "Column not found" });
      }

      const columnData = df[column].values.filter(
        (val) => val !== null && !isNaN(val)
      );

      const min = Math.min(...columnData);
      const max = Math.max(...columnData);
      const binCount = 10;
      const binSize = (max - min) / binCount;

      const bins = Array(binCount).fill(0);
      const labels = [];

      for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = binStart + binSize;
        labels.push(`${binStart.toFixed(2)}-${binEnd.toFixed(2)}`);
      }

      // Count values in each bin
      columnData.forEach((value) => {
        const binIndex = Math.min(
          Math.floor((value - min) / binSize),
          binCount - 1
        );
        bins[binIndex]++;
      });

      return res.status(200).json({
        message: "Success",
        histogram: {
          labels,
          data: bins,
          min,
          max,
          binSize,
        },
      });
    } catch (error) {
      console.error("Histogram Error:", error);
      return res.status(500).json({
        message: "Error generating histogram",
        error: error.toString(),
      });
    }
  },

  getView: async (req, res) => {
    const { fileUrl, page = 1, pageSize = 50 } = req.body;
    if (!fileUrl)
      return res.status(400).json({ message: "fileUrl is required" });

    try {
      const filePath = await downloadFile(fileUrl);

      // Validate file exists and has content
      const stats = fs.statSync(filePath);
      if (stats.size === 0) {
        throw new Error("File is empty");
      }

      // Try to read the file with error handling
      let df;
      try {
        df = await dfd.readCSV(filePath);
      } catch (readError) {
        throw new Error(`Failed to read CSV file: ${readError.message}`);
      }

      if (!df || df.shape[0] === 0) {
        throw new Error("No data found in CSV file");
      }

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
      return res.status(500).json({
        message: "Error processing CSV file",
        error: error.message,
        details: error.toString(),
      });
    }
  },

  getScatterPlot: async (req, res) => {
    const { fileUrl, xColumn, yColumn } = req.body;
    if (!fileUrl || !xColumn || !yColumn) {
      return res.status(400).json({
        message: "fileUrl, xColumn, and yColumn are required",
      });
    }

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readCSV(filePath);

      // Validate columns exist
      if (!df.columns.includes(xColumn) || !df.columns.includes(yColumn)) {
        return res.status(400).json({
          message: "One or both columns not found in the dataset",
        });
      }

      // Get data points, filtering out null/NaN values
      const xValues = df[xColumn].values;
      const yValues = df[yColumn].values;

      const scatterData = [];
      for (let i = 0; i < xValues.length; i++) {
        if (
          xValues[i] !== null &&
          yValues[i] !== null &&
          !isNaN(xValues[i]) &&
          !isNaN(yValues[i])
        ) {
          scatterData.push({
            x: xValues[i],
            y: yValues[i],
          });
        }
      }

      return res.status(200).json({
        message: "Success",
        scatterPlot: {
          data: scatterData,
          xColumn,
          yColumn,
          pointCount: scatterData.length,
        },
      });
    } catch (error) {
      console.error("ScatterPlot Error:", error);
      return res.status(500).json({
        message: "Error generating scatter plot",
        error: error.toString(),
      });
    }
  },

  getBoxPlot: async (req, res) => {
    const { fileUrl, column } = req.body;
    if (!fileUrl || !column) {
      return res.status(400).json({
        message: "fileUrl and column are required",
      });
    }

    try {
      const filePath = await downloadFile(fileUrl);
      const df = await dfd.readCSV(filePath);

      // Validate column exists
      if (!df.columns.includes(column)) {
        return res.status(400).json({
          message: "Column not found in the dataset",
        });
      }

      // Get column data, filtering out null/NaN values
      const values = df[column].values.filter(
        (val) => val !== null && !isNaN(val)
      );

      if (values.length === 0) {
        return res.status(400).json({
          message: "No valid numeric data found in the column",
        });
      }

      return res.status(200).json({
        message: "Success",
        boxPlot: {
          data: values,
          column,
        },
      });
    } catch (error) {
      console.error("BoxPlot Error:", error);
      return res.status(500).json({
        message: "Error generating box plot",
        error: error.toString(),
      });
    }
  },

  editCsv: async (req, res) => {
    const {
      fileUrl,
      editType,
      rowIndex,
      columnName,
      value,
      rowData,
      columnData,
      newColumnName,
      bulkEdits,
    } = req.body;
    if (!fileUrl || !editType) {
      return res
        .status(400)
        .json({ message: "fileUrl and editType are required" });
    }
    try {
      const filePath = await downloadFile(fileUrl);
      let df = await dfd.readCSV(filePath);
      let changed = false;
      switch (editType) {
        case "cell":
          if (rowIndex == null || !columnName)
            return res
              .status(400)
              .json({ message: "rowIndex and columnName required" });
          df.at(rowIndex, columnName, value);
          changed = true;
          break;
        case "row":
          if (rowIndex == null || !rowData)
            return res
              .status(400)
              .json({ message: "rowIndex and rowData required" });
          Object.entries(rowData).forEach(([col, val]) =>
            df.at(rowIndex, col, val)
          );
          changed = true;
          break;
        case "column":
          if (!columnName || !columnData)
            return res
              .status(400)
              .json({ message: "columnName and columnData required" });
          df.addColumn(columnName, columnData, { inplace: true });
          changed = true;
          break;
        case "addRow":
          if (!rowData)
            return res.status(400).json({ message: "rowData required" });
          df = dfd.concat({
            dfList: [df, new dfd.DataFrame([rowData])],
            axis: 0,
          });
          changed = true;
          break;
        case "deleteRow":
          if (rowIndex == null)
            return res.status(400).json({ message: "rowIndex required" });
          df.drop({ index: [rowIndex], inplace: true });
          changed = true;
          break;
        case "addColumn":
          if (!newColumnName || !columnData)
            return res
              .status(400)
              .json({ message: "newColumnName and columnData required" });
          df.addColumn(newColumnName, columnData, { inplace: true });
          changed = true;
          break;
        case "deleteColumn":
          if (!columnName)
            return res.status(400).json({ message: "columnName required" });
          df.drop({ columns: [columnName], inplace: true });
          changed = true;
          break;
        case "bulk":
          if (!bulkEdits || !Array.isArray(bulkEdits))
            return res
              .status(400)
              .json({ message: "bulkEdits array required" });
          bulkEdits.forEach((edit) => {
            if (edit.type === "cell")
              df.at(edit.rowIndex, edit.columnName, edit.value);
            else if (edit.type === "row")
              Object.entries(edit.rowData).forEach(([col, val]) =>
                df.at(edit.rowIndex, col, val)
              );
            else if (edit.type === "column")
              df.addColumn(edit.columnName, edit.columnData, { inplace: true });
          });
          changed = true;
          break;
        default:
          return res.status(400).json({ message: "Unknown editType" });
      }
      if (!changed) return res.status(400).json({ message: "No changes made" });
      // Save to CSV
      const tempOut = filePath.replace(/\.csv$/, `_edited.csv`);
      await df.toCSV(tempOut, { index: false });
      // Upload to Supabase (overwrite)
      const fileName = require("path").basename(fileUrl);
      const fileBuffer = require("fs").readFileSync(tempOut);
      const { data, error } = await require("../db/connectDB.js")
        .default.storage.from("datasets")
        .upload(fileName, fileBuffer, {
          upsert: true,
          contentType: "text/csv",
        });
      if (error)
        return res.status(500).json({
          message: "Failed to upload edited file",
          error: error.message,
        });
      return res
        .status(200)
        .json({ message: "CSV edited and saved successfully" });
    } catch (error) {
      console.error("Edit CSV Error:", error);
      return res
        .status(500)
        .json({ message: "Error editing CSV", error: error.toString() });
    }
  },
};

export default AnalyseController;
